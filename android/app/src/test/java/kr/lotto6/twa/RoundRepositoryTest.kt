package kr.lotto6.twa

import kotlinx.coroutines.test.runTest
import kotlinx.serialization.json.Json
import kr.lotto6.twa.data.LottoRound
import kr.lotto6.twa.data.RoundRepository
import kr.lotto6.twa.data.RoundSource
import kr.lotto6.twa.data.RoundStore
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

private val json = Json { encodeDefaults = true }

private fun round(no: Int) = LottoRound(
    roundNo = no,
    drawDate = "2026-01-01",
    numbers = listOf(1, 2, 3, 4, 5, 6),
    bonusNo = 7,
)

private class FakeStore(bundled: List<LottoRound>) : RoundStore {
    private val bundledJson = json.encodeToString(bundled)
    var extras: String? = null
    override fun readBundled() = bundledJson
    override fun readExtras() = extras
    override fun writeExtras(json: String) { extras = json }
}

private class FakeSource(
    private val latest: Int,
    private val unavailable: Set<Int> = emptySet(),
    private val invalid: Set<Int> = emptySet(),
) : RoundSource {
    val requested = mutableListOf<Int?>()
    override suspend fun fetchRound(drwNo: Int?): LottoRound? {
        requested.add(drwNo)
        val no = drwNo ?: latest
        if (no in unavailable) return null
        if (no in invalid) return round(no).copy(numbers = listOf(1, 1, 1, 1, 1, 99))
        return round(no)
    }
}

class RoundRepositoryTest {

    @Test
    fun `refresh adds the new round and keeps it out of the bundled snapshot copy`() = runTest {
        val store = FakeStore((1..10).map(::round))
        val repo = RoundRepository(store, FakeSource(latest = 11))

        assertTrue(repo.refresh())

        assertEquals(11, repo.all().first().roundNo)
        val persisted = json.decodeFromString<List<LottoRound>>(store.extras!!)
        assertEquals(listOf(11), persisted.map { it.roundNo })
    }

    @Test
    fun `refresh reports no change when already current`() = runTest {
        val store = FakeStore((1..10).map(::round))
        val repo = RoundRepository(store, FakeSource(latest = 10))

        assertFalse(repo.refresh())
        assertNull(store.extras)
    }

    /** 오래 앱을 열지 않아 공백이 maxFetch보다 커져도 이후 실행에서 이어서 채워져야 한다. */
    @Test
    fun `refresh closes a gap larger than maxFetch across repeated runs`() = runTest {
        val store = FakeStore((1..10).map(::round))
        val repo = RoundRepository(store, FakeSource(latest = 30))

        repo.refresh(maxFetch = 5)
        assertEquals(
            "첫 실행은 최신 회차부터 maxFetch개까지만 채운다",
            listOf(30, 29, 28, 27, 26, 25),
            repo.all().map { it.roundNo }.take(6),
        )

        repeat(5) { repo.refresh(maxFetch = 5) }

        assertEquals(
            "반복 실행으로 11..30 공백이 모두 메워져야 한다",
            (1..30).toList(),
            repo.all().map { it.roundNo }.sorted(),
        )
    }

    @Test
    fun `refresh skips rounds the source cannot provide without blocking the rest`() = runTest {
        val store = FakeStore((1..10).map(::round))
        val repo = RoundRepository(store, FakeSource(latest = 15, unavailable = setOf(13)))

        repeat(3) { repo.refresh() }

        assertEquals((1..15).minus(13).toList(), repo.all().map { it.roundNo }.sorted())
    }

    @Test
    fun `refresh does not store a round that fails validation`() = runTest {
        val store = FakeStore((1..10).map(::round))
        val repo = RoundRepository(store, FakeSource(latest = 12, invalid = setOf(11)))

        repo.refresh()

        assertNull("깨진 회차는 로컬에 남기지 않는다", repo.round(11))
        assertEquals(12, repo.all().first().roundNo)
    }

    @Test
    fun `refresh reports failure when the latest round itself is unavailable`() = runTest {
        val store = FakeStore((1..10).map(::round))
        val repo = RoundRepository(store, FakeSource(latest = 11, unavailable = setOf(11)))

        assertFalse(repo.refresh())
        assertEquals(10, repo.all().first().roundNo)
    }
}
