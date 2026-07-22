package kr.lotto6.twa.data

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Prize(
    @SerialName("k") val rank: Int,
    @SerialName("t") val totalAmount: Long,
    @SerialName("w") val winnerCount: Long,
    @SerialName("e") val perAmount: Long,
)

@Serializable
data class LottoRound(
    @SerialName("r") val roundNo: Int,
    @SerialName("d") val drawDate: String,
    @SerialName("n") val numbers: List<Int>,
    @SerialName("b") val bonusNo: Int,
    @SerialName("s") val totalSales: Long = 0,
    @SerialName("p") val prizes: List<Prize> = emptyList(),
) {
    val firstPrize: Prize? get() = prizes.firstOrNull { it.rank == 1 }

    /** 네트워크로 받은 회차를 로컬에 남기기 전 확인한다 — 원본 페이지 구조가 바뀌면 값이 깨질 수 있다. */
    fun isValid(): Boolean =
        roundNo > 0 &&
            numbers.size == 6 &&
            numbers.toSet().size == 6 &&
            numbers.all { it in 1..45 } &&
            bonusNo in 1..45 &&
            bonusNo !in numbers
}
