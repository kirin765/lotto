package kr.lotto6.twa.data

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.net.HttpURLConnection
import java.net.URL

@Serializable
private data class ApiPrize(
    val rank: Int = 0,
    val totalAmount: Long = 0,
    val winnerCount: Long = 0,
    val perAmount: Long = 0,
)

@Serializable
private data class ApiRound(
    val returnValue: String = "fail",
    val drwNo: Int = 0,
    val drwNoDate: String = "",
    val drwtNo1: Int = 0,
    val drwtNo2: Int = 0,
    val drwtNo3: Int = 0,
    val drwtNo4: Int = 0,
    val drwtNo5: Int = 0,
    val drwtNo6: Int = 0,
    val bnusNo: Int = 0,
    val totSellamnt: Long = 0,
    val prizes: List<ApiPrize> = emptyList(),
)

/** 회차 데이터 원본. 앱이 직접 조회해 로컬에 적재하고, 화면 렌더링·통계는 전부 기기에서 처리한다. */
class LottoApi(private val baseUrl: String = "https://lotto6.kr/api/lotto") {

    private val json = Json { ignoreUnknownKeys = true }

    /** [drwNo]가 null이면 최신 회차를 조회한다. 실패 시 null. */
    suspend fun fetchRound(drwNo: Int? = null): LottoRound? = withContext(Dispatchers.IO) {
        fromApi(drwNo) ?: fromNaver(drwNo)
    }

    private fun fromApi(drwNo: Int?): LottoRound? {
        val query = drwNo?.toString() ?: "latest"
        val body = get("$baseUrl?drwNo=$query") ?: return null
        val parsed = runCatching { json.decodeFromString<ApiRound>(body) }.getOrNull() ?: return null
        if (parsed.returnValue != "success" || parsed.drwNo <= 0) return null
        return LottoRound(
            roundNo = parsed.drwNo,
            drawDate = parsed.drwNoDate,
            numbers = listOf(
                parsed.drwtNo1, parsed.drwtNo2, parsed.drwtNo3,
                parsed.drwtNo4, parsed.drwtNo5, parsed.drwtNo6,
            ).sorted(),
            bonusNo = parsed.bnusNo,
            totalSales = parsed.totSellamnt,
            prizes = parsed.prizes.map { Prize(it.rank, it.totalAmount, it.winnerCount, it.perAmount) },
        )
    }

    /** 서버 API가 막혔을 때 기기에서 직접 네이버를 조회한다. */
    private fun fromNaver(drwNo: Int?): LottoRound? {
        val html = get(
            NaverSource.searchUrl(drwNo),
            mapOf("User-Agent" to NaverSource.UA, "Accept-Language" to "ko-KR,ko;q=0.9"),
        ) ?: return null
        val round = NaverSource.parse(html) ?: return null
        return if (drwNo == null || round.roundNo == drwNo) round else null
    }

    private fun get(url: String, headers: Map<String, String> = emptyMap()): String? = runCatching {
        val conn = (URL(url).openConnection() as HttpURLConnection).apply {
            connectTimeout = 8000
            readTimeout = 12000
            requestMethod = "GET"
            setRequestProperty("Accept", "application/json")
            headers.forEach { (k, v) -> setRequestProperty(k, v) }
        }
        try {
            if (conn.responseCode != 200) return null
            conn.inputStream.bufferedReader().use { it.readText() }
        } finally {
            conn.disconnect()
        }
    }.getOrNull()
}
