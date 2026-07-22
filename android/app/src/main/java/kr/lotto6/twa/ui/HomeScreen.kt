package kr.lotto6.twa.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import kr.lotto6.twa.data.LottoRound
import kr.lotto6.twa.util.formatAmount
import kr.lotto6.twa.util.formatDate
import kr.lotto6.twa.util.formatPrize
import kr.lotto6.twa.util.withCommas

@Composable
fun HomeScreen(
    round: LottoRound?,
    isLatest: Boolean,
    loading: Boolean,
    prevRound: Int?,
    nextRound: Int?,
    onSelectRound: (Int?) -> Unit,
    modifier: Modifier = Modifier,
) {
    if (loading || round == null) {
        Box(modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            if (loading) CircularProgressIndicator() else Text("당첨번호를 불러올 수 없습니다.")
        }
        return
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        SurfaceCard {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    text = "${withCommas(round.roundNo.toLong())}회",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                )
                if (isLatest) {
                    Text(
                        text = "최신",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onPrimary,
                        modifier = Modifier
                            .background(MaterialTheme.colorScheme.primary, RoundedCornerShape(999.dp))
                            .padding(horizontal = 10.dp, vertical = 4.dp),
                    )
                }
            }
            Text(
                text = "${formatDate(round.drawDate)} 추첨",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Box(
                modifier = Modifier.fillMaxWidth().padding(top = 20.dp, bottom = 8.dp),
                contentAlignment = Alignment.Center,
            ) {
                LottoBallRow(round.numbers, round.bonusNo, ballSize = 44.dp)
            }
            round.firstPrize?.let { first ->
                HorizontalDivider(
                    modifier = Modifier.padding(vertical = 12.dp),
                    color = MaterialTheme.colorScheme.outline,
                )
                Text(
                    text = "1등 ${withCommas(first.winnerCount)}명 · 1인당 ${formatPrize(first.perAmount)}",
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.fillMaxWidth(),
                    textAlign = TextAlign.Center,
                )
            }
        }

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
            OutlinedButton(
                onClick = { prevRound?.let(onSelectRound) },
                enabled = prevRound != null,
                modifier = Modifier.weight(1f),
            ) { Text("← ${prevRound ?: round.roundNo - 1}회") }
            OutlinedButton(
                onClick = { nextRound?.let(onSelectRound) },
                enabled = nextRound != null,
                modifier = Modifier.weight(1f),
            ) { Text("${nextRound ?: round.roundNo + 1}회 →") }
        }
        if (!isLatest) {
            Button(
                onClick = { onSelectRound(null) },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant,
                    contentColor = MaterialTheme.colorScheme.onSurfaceVariant,
                ),
            ) { Text("최신 회차로") }
        }

        if (round.prizes.isNotEmpty()) {
            SurfaceCard {
                SectionTitle("등수별 당첨 정보")
                Column(modifier = Modifier.padding(top = 12.dp)) {
                    round.prizes.sortedBy { it.rank }.forEach { prize ->
                        Row(
                            modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                        ) {
                            Text("${prize.rank}등", fontWeight = FontWeight.Bold)
                            Column(horizontalAlignment = Alignment.End) {
                                Text(
                                    formatAmount(prize.perAmount),
                                    style = MaterialTheme.typography.bodyMedium,
                                )
                                Text(
                                    "${withCommas(prize.winnerCount)}게임",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
