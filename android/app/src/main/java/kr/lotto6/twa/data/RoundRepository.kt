package kr.lotto6.twa.data

import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.serialization.json.Json

/** 번들 스냅샷 읽기 + 설치 후 추가된 회차의 로컬 보관. */
interface RoundStore {
    fun readBundled(): String
    fun readExtras(): String?
    fun writeExtras(json: String)
}

/**
 * 회차 저장소. 앱에 동봉된 전 회차 스냅샷을 기본으로 삼고, 스냅샷 이후 회차만 네트워크로 채운다.
 * 조회·통계·이력은 전부 이 로컬 데이터로 처리하므로 오프라인에서도 동작한다.
 */
class RoundRepository(
    private val store: RoundStore,
    private val api: LottoApi = LottoApi(),
) {
    private val json = Json { ignoreUnknownKeys = true; encodeDefaults = true }
    private val mutex = Mutex()
    private val byRound = HashMap<Int, LottoRound>()
    private var loaded = false
    private var bundledMax = 0

    suspend fun load(): List<LottoRound> = mutex.withLock {
        loadLocked()
        snapshot()
    }

    /** 최신 회차를 확인하고 빠진 회차를 채운다. 새 회차를 하나라도 받으면 true. */
    suspend fun refresh(maxFetch: Int = 30): Boolean {
        mutex.withLock { loadLocked() }
        val latest = api.fetchRound(null) ?: return false
        val fetched = mutableListOf(latest)
        val knownMax = mutex.withLock { byRound.keys.maxOrNull() ?: 0 }
        if (latest.roundNo > knownMax + 1) {
            val from = (latest.roundNo - maxFetch).coerceAtLeast(knownMax + 1)
            for (no in from until latest.roundNo) {
                if (mutex.withLock { byRound.containsKey(no) }) continue
                api.fetchRound(no)?.let { fetched.add(it) }
            }
        }
        return mutex.withLock {
            val added = fetched.filter { byRound[it.roundNo] != it }
            if (added.isEmpty()) return@withLock false
            added.forEach { byRound[it.roundNo] = it }
            persistExtras()
            true
        }
    }

    suspend fun all(): List<LottoRound> = mutex.withLock { snapshot() }

    suspend fun round(no: Int): LottoRound? = mutex.withLock { byRound[no] }

    private fun loadLocked() {
        if (loaded) return
        val bundled = decode(store.readBundled())
        bundled.forEach { byRound[it.roundNo] = it }
        bundledMax = bundled.maxOfOrNull { it.roundNo } ?: 0
        store.readExtras()?.let { extras -> decode(extras).forEach { byRound[it.roundNo] = it } }
        loaded = true
    }

    private fun snapshot(): List<LottoRound> = byRound.values.sortedByDescending { it.roundNo }

    /** 번들 스냅샷보다 뒤 회차만 로컬에 남긴다(번들 데이터 중복 저장 방지). */
    private fun persistExtras() {
        val extras = byRound.values.filter { it.roundNo > bundledMax }.sortedBy { it.roundNo }
        store.writeExtras(json.encodeToString(extras))
    }

    private fun decode(text: String): List<LottoRound> =
        runCatching { json.decodeFromString<List<LottoRound>>(text) }.getOrDefault(emptyList())
}
