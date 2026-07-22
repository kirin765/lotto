package kr.lotto6.twa.util

import androidx.compose.ui.graphics.Color

/** 웹의 formatPrize와 동일 규칙(억/천만/만 단위 축약). */
fun formatPrize(amount: Long): String {
    if (amount >= 100_000_000L) {
        val eok = amount / 100_000_000L
        val remainder = amount % 100_000_000L
        if (remainder >= 10_000_000L) return "${eok}억 ${remainder / 10_000_000L}천만원"
        return "${eok}억원"
    }
    if (amount >= 10_000_000L) return "${amount / 10_000_000L}천만원"
    if (amount >= 10_000L) return "${withCommas(amount / 10_000L)}만원"
    return "${withCommas(amount)}원"
}

fun formatAmount(amount: Long): String = "${withCommas(amount)}원"

fun withCommas(value: Long): String {
    val s = value.toString()
    val sb = StringBuilder()
    for ((i, c) in s.withIndex()) {
        if (i > 0 && (s.length - i) % 3 == 0) sb.append(',')
        sb.append(c)
    }
    return sb.toString()
}

fun formatDate(dateStr: String): String = dateStr.replace('-', '.')

/** 웹과 동일한 번호대별 공 색상. */
fun ballColor(number: Int): Pair<Color, Color> = when {
    number <= 10 -> Color(0xFFFACC15) to Color(0xFF713F12)
    number <= 20 -> Color(0xFF3B82F6) to Color.White
    number <= 30 -> Color(0xFFEF4444) to Color.White
    number <= 40 -> Color(0xFF6B7280) to Color.White
    else -> Color(0xFF22C55E) to Color.White
}
