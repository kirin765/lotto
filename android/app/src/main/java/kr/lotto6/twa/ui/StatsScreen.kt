package kr.lotto6.twa.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import kr.lotto6.twa.data.LottoRound
import kr.lotto6.twa.data.computeStats

private val WINDOWS = listOf(50, 100, 0)

@Composable
fun StatsScreen(rounds: List<LottoRound>, modifier: Modifier = Modifier) {
    var window by remember { mutableIntStateOf(100) }
    val sample = remember(window, rounds) {
        if (window == 0) rounds else rounds.take(window)
    }
    val stats = remember(sample) { computeStats(sample).sortedByDescending { it.frequency } }
    val maxFreq = stats.firstOrNull()?.frequency ?: 1

    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                WINDOWS.forEach { w ->
                    FilterChip(
                        selected = window == w,
                        onClick = { window = w },
                        label = { Text(if (w == 0) "전체" else "최근 ${w}회") },
                    )
                }
            }
        }
        item {
            Text(
                "총 ${sample.size}회차 기준 · 번호별 출현 빈도",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        items(stats, key = { it.number }) { stat ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                LottoBall(stat.number, 34.dp)
                Column(modifier = Modifier.weight(1f)) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(8.dp)
                            .background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(4.dp)),
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth(stat.frequency.toFloat() / maxFreq)
                                .fillMaxHeight()
                                .background(MaterialTheme.colorScheme.secondary, RoundedCornerShape(4.dp)),
                        )
                    }
                    Text(
                        text = if (stat.lastRound == 0) "이 구간에서 미출현"
                        else "최근 ${stat.lastRound}회 · 평균 ${stat.avgInterval}회 간격",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(top = 4.dp),
                    )
                }
                Text(
                    text = "${stat.frequency}회",
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.width(44.dp),
                )
            }
        }
    }
}
