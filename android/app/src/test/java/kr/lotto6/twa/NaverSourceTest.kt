package kr.lotto6.twa

import kr.lotto6.twa.data.NaverSource
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class NaverSourceTest {

    private val html = """
        <div class="lotto_area" data-text="1233회차 (2026.07.18.)">
          <div class="winning_number">
            <span class="ball type2">2</span>
            <span class="ball type1">7</span>
            <span class="ball type3">20</span>
            <span class="ball type3">25</span>
            <span class="ball type4">37</span>
            <span class="ball type4">40</span>
          </div>
          <div class="bonus_number">
            <span class="ball type3">29</span>
          </div>
          <table>
            <tr>
              <th scope="row" rowspan="3">1등</th>
              <td class="sub_title">총 당첨금</td><td>25,976,927,276원</td>
              <td class="sub_title">당첨게임 수</td><td>31개</td>
              <td class="sub_title">1개당 당첨금</td><td>837,965,396원</td>
            </tr>
            <tr>
              <th scope="row" rowspan="3">2등</th>
              <td class="sub_title">총 당첨금</td><td>4,329,487,896원</td>
              <td class="sub_title">당첨 복권수</td><td>76개</td>
              <td class="sub_title">1개당 당첨금</td><td>56,966,946원</td>
            </tr>
          </table>
        </div>
    """.trimIndent()

    @Test
    fun `parses round, date, numbers and bonus`() {
        val round = NaverSource.parse(html)!!
        assertEquals(1233, round.roundNo)
        assertEquals("2026-07-18", round.drawDate)
        assertEquals(listOf(2, 7, 20, 25, 37, 40), round.numbers)
        assertEquals(29, round.bonusNo)
    }

    @Test
    fun `parses prize rows regardless of the winner-count label wording`() {
        val round = NaverSource.parse(html)!!
        assertEquals(2, round.prizes.size)
        val first = round.firstPrize!!
        assertEquals(31L, first.winnerCount)
        assertEquals(837_965_396L, first.perAmount)
        assertEquals(25_976_927_276L, first.totalAmount)
        assertEquals(76L, round.prizes.first { it.rank == 2 }.winnerCount)
    }

    @Test
    fun `returns null when the page has no draw block`() {
        assertNull(NaverSource.parse("<html><body>차단되었습니다</body></html>"))
    }

    @Test
    fun `builds a search url per round`() {
        assertEquals(true, NaverSource.searchUrl(null).endsWith("query=%EB%A1%9C%EB%98%90%EB%8B%B9%EC%B2%A8%EB%B2%88%ED%98%B8"))
        assertEquals(true, NaverSource.searchUrl(1233).contains("1233"))
    }
}
