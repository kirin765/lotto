package kr.lotto6.twa.data

data class NumberStat(
    val number: Int,
    val frequency: Int,
    val lastRound: Int,
    val avgInterval: Int,
)

/** 번호별 출현 빈도·마지막 출현 회차·평균 출현 간격. 웹의 /stats 계산과 동일 정의. */
fun computeStats(rounds: List<LottoRound>): List<NumberStat> {
    val appearances = HashMap<Int, MutableList<Int>>()
    for (n in 1..45) appearances[n] = mutableListOf()
    for (round in rounds) {
        for (num in round.numbers) appearances[num]?.add(round.roundNo)
    }
    return (1..45).map { number ->
        val sorted = appearances.getValue(number).sorted()
        val avg = if (sorted.size < 2) 0
        else Math.round((sorted.last() - sorted.first()).toDouble() / (sorted.size - 1)).toInt()
        NumberStat(
            number = number,
            frequency = sorted.size,
            lastRound = sorted.lastOrNull() ?: 0,
            avgInterval = avg,
        )
    }
}
