package kr.lotto6.twa

import kr.lotto6.twa.data.LottoRound
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class LottoUiStateTest {

    /** 645회처럼 원본에서 못 가져온 회차가 있어도 이전/다음 이동이 최신 회차로 튀지 않아야 한다. */
    private val rounds = listOf(648, 647, 646, 644, 643).map {
        LottoRound(it, "2015-01-01", listOf(1, 2, 3, 4, 5, 6), 7)
    }

    private fun stateAt(roundNo: Int) =
        LottoUiState(rounds = rounds, loading = false, selectedRound = roundNo)

    @Test
    fun `previous skips a missing round`() {
        assertEquals(644, stateAt(646).prevRound)
    }

    @Test
    fun `next skips a missing round`() {
        assertEquals(646, stateAt(644).nextRound)
    }

    @Test
    fun `neighbours are null at both ends`() {
        assertNull(stateAt(648).nextRound)
        assertNull(stateAt(643).prevRound)
    }

    @Test
    fun `selecting a round that does not exist falls back to the latest`() {
        assertEquals(648, stateAt(645).current?.roundNo)
    }
}
