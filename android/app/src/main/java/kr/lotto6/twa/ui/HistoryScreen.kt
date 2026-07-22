package kr.lotto6.twa.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.ui.unit.dp
import kr.lotto6.twa.data.LottoRound
import kr.lotto6.twa.util.formatDate

@Composable
fun HistoryScreen(
    rounds: List<LottoRound>,
    onSelectRound: (Int) -> Unit,
    modifier: Modifier = Modifier,
) {
    var query by remember { mutableStateOf("") }
    val filtered = remember(query, rounds) {
        val no = query.trim().toIntOrNull()
        if (no == null) rounds else rounds.filter { it.roundNo.toString().startsWith(no.toString()) }
    }

    Column(modifier = modifier.fillMaxSize()) {
        OutlinedTextField(
            value = query,
            onValueChange = { input -> query = input.filter { it.isDigit() }.take(5) },
            label = { Text("회차 검색") },
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            modifier = Modifier.fillMaxWidth().padding(16.dp),
        )
        if (filtered.isEmpty()) {
            Text(
                "해당 회차가 없습니다.",
                modifier = Modifier.fillMaxWidth().padding(32.dp),
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            return@Column
        }
        LazyColumn(modifier = Modifier.fillMaxSize()) {
            items(filtered, key = { it.roundNo }) { round ->
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onSelectRound(round.roundNo) }
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text("${round.roundNo}회", fontWeight = FontWeight.Bold)
                        Text(
                            formatDate(round.drawDate),
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                    LottoBallRow(round.numbers, round.bonusNo, ballSize = 32.dp)
                }
                HorizontalDivider(color = MaterialTheme.colorScheme.outline)
            }
        }
    }
}
