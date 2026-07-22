package kr.lotto6.twa

import kotlinx.coroutines.test.runTest
import kr.lotto6.twa.data.LottoRound
import kr.lotto6.twa.data.Prize
import kr.lotto6.twa.data.RoundRepository
import kr.lotto6.twa.data.RoundStore
import kr.lotto6.twa.data.computeStats
import kr.lotto6.twa.data.generateNumbers
import kr.lotto6.twa.data.matchAgainst
import kr.lotto6.twa.util.formatPrize
import kr.lotto6.twa.util.withCommas
import kotlinx.serialization.json.Json
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlin.random.Random

class LottoLogicTest {

    private fun round(no: Int, numbers: List<Int>, bonus: Int = 45) =
        LottoRound(no, "2026-01-01", numbers, bonus)

    @Test
    fun `generator returns six sorted numbers excluding the excluded set`() {
        val excluded = setOf(1, 2, 3, 4, 5)
        repeat(50) {
            val picked = generateNumbers(excluded, Random(it))!!
            assertEquals(6, picked.size)
            assertEquals(6, picked.toSet().size)
            assertEquals(picked.sorted(), picked)
            assertTrue(picked.none { n -> n in excluded })
            assertTrue(picked.all { n -> n in 1..45 })
        }
    }

    @Test
    fun `generator fails when fewer than six numbers remain`() {
        assertNull(generateNumbers((1..40).toSet()))
    }

    @Test
    fun `stats count frequency, last round and average interval`() {
        val rounds = listOf(
            round(3, listOf(1, 2, 3, 4, 5, 6)),
            round(2, listOf(1, 7, 8, 9, 10, 11)),
            round(1, listOf(1, 12, 13, 14, 15, 16)),
        )
        val stats = computeStats(rounds).associateBy { it.number }
        assertEquals(3, stats.getValue(1).frequency)
        assertEquals(3, stats.getValue(1).lastRound)
        assertEquals(1, stats.getValue(1).avgInterval)
        assertEquals(0, stats.getValue(45).frequency)
        assertEquals(0, stats.getValue(45).lastRound)
    }

    @Test
    fun `rank is derived from matched count and bonus`() {
        val drawn = round(10, listOf(1, 2, 3, 4, 5, 6), bonus = 7)
        assertEquals(1, matchAgainst(listOf(1, 2, 3, 4, 5, 6), drawn).rank)
        assertEquals(2, matchAgainst(listOf(1, 2, 3, 4, 5, 7), drawn).rank)
        assertEquals(3, matchAgainst(listOf(1, 2, 3, 4, 5, 8), drawn).rank)
        assertEquals(4, matchAgainst(listOf(1, 2, 3, 4, 8, 9), drawn).rank)
        assertEquals(5, matchAgainst(listOf(1, 2, 3, 8, 9, 10), drawn).rank)
        assertEquals(0, matchAgainst(listOf(1, 2, 8, 9, 10, 11), drawn).rank)
    }

    @Test
    fun `prize formatting matches the web rules`() {
        assertEquals("2억 5천만원", formatPrize(255_000_000))
        assertEquals("2억원", formatPrize(200_500_000))
        assertEquals("5천만원", formatPrize(50_000_000))
        assertEquals("5만원", formatPrize(50_000))
        assertEquals("5,000원", formatPrize(5_000))
        assertEquals("1,234,567", withCommas(1_234_567))
    }

    @Test
    fun `repository merges bundled snapshot with locally stored rounds`() = runTest {
        val json = Json { encodeDefaults = true }
        val bundled = listOf(
            LottoRound(1, "2002-12-07", listOf(1, 2, 3, 4, 5, 6), 7),
            LottoRound(2, "2002-12-14", listOf(2, 3, 4, 5, 6, 7), 8, prizes = listOf(Prize(1, 100, 2, 50))),
        )
        val extras = listOf(LottoRound(3, "2002-12-21", listOf(3, 4, 5, 6, 7, 8), 9))
        var written: String? = null
        val store = object : RoundStore {
            override fun readBundled() = json.encodeToString(bundled)
            override fun readExtras() = json.encodeToString(extras)
            override fun writeExtras(json: String) { written = json }
        }
        val repo = RoundRepository(store)
        val all = repo.load()
        assertEquals(listOf(3, 2, 1), all.map { it.roundNo })
        assertEquals(50L, repo.round(2)?.firstPrize?.perAmount)
        assertNotNull(repo.round(3))
        assertNull(written)
    }
}
