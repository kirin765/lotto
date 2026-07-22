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
}
