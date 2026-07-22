package kr.lotto6.twa.data

import java.net.URLEncoder

/**
 * 네이버 검색 결과에서 회차 정보를 뽑는 파서.
 * 서버 API가 막혔을 때 기기에서 직접 조회하는 폴백 경로라, 웹의 파싱 규칙과 같은 형태를 유지한다.
 */
object NaverSource {

    const val UA =
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 " +
            "(KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"

    fun searchUrl(drwNo: Int?): String {
        val query = if (drwNo == null) "로또당첨번호" else "로또 ${drwNo}회 당첨번호"
        return "https://m.search.naver.com/search.naver?where=m&query=" +
            URLEncoder.encode(query, "UTF-8")
    }

    private val roundRegex = Regex("""data-text="(\d+)회차\s*\((\d{4}\.\d{2}\.\d{2})\.\)"""")
    private val ballRegex = Regex("""class="ball type\d">(\d+)""")
    private val bonusRegex = Regex("""bonus_number">\s*<span class="ball type\d">(\d+)""")
    private val prizeRegex = Regex(
        """<th scope="row" rowspan="\d+">(\d)등</th>\s*<td class="sub_title">총 당첨금</td>\s*""" +
            """<td>([\d,]+)원</td>[\s\S]*?당첨[^<]*수</td>\s*<td>([\d,]+)개</td>""" +
            """[\s\S]*?1개당 당첨금</td>\s*<td>([\d,]+)원</td>"""
    )

    fun parse(html: String): LottoRound? {
        val round = roundRegex.find(html) ?: return null
        val balls = ballRegex.findAll(html).map { it.groupValues[1].toInt() }.toList()
        if (balls.size < 6) return null

        val prizes = prizeRegex.findAll(html).map { m ->
            Prize(
                rank = m.groupValues[1].toInt(),
                totalAmount = m.groupValues[2].toAmount(),
                winnerCount = m.groupValues[3].toAmount(),
                perAmount = m.groupValues[4].toAmount(),
            )
        }.toList()

        return LottoRound(
            roundNo = round.groupValues[1].toInt(),
            drawDate = round.groupValues[2].replace('.', '-'),
            numbers = balls.take(6).sorted(),
            bonusNo = bonusRegex.find(html)?.groupValues?.get(1)?.toInt() ?: 0,
            prizes = prizes,
        )
    }

    private fun String.toAmount(): Long = replace(",", "").toLongOrNull() ?: 0L
}
