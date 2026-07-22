package kr.lotto6.twa.data

import kotlin.random.Random

/** 제외번호를 뺀 풀에서 6개를 뽑는다. 풀이 6개 미만이면 null. */
fun generateNumbers(excluded: Set<Int>, random: Random = Random.Default): List<Int>? {
    val pool = (1..45).filterNot { it in excluded }.toMutableList()
    if (pool.size < 6) return null
    for (i in pool.indices.reversed()) {
        val j = random.nextInt(i + 1)
        pool[i] = pool[j].also { pool[j] = pool[i] }
    }
    return pool.take(6).sorted()
}

data class MatchResult(val matched: List<Int>, val bonusMatched: Boolean) {
    /** 1~5등, 미당첨은 0. */
    val rank: Int
        get() = when {
            matched.size == 6 -> 1
            matched.size == 5 && bonusMatched -> 2
            matched.size == 5 -> 3
            matched.size == 4 -> 4
            matched.size == 3 -> 5
            else -> 0
        }
}

fun matchAgainst(picked: List<Int>, round: LottoRound): MatchResult =
    MatchResult(
        matched = picked.filter { it in round.numbers }.sorted(),
        bonusMatched = round.bonusNo in picked,
    )
