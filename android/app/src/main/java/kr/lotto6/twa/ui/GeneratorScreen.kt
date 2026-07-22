package kr.lotto6.twa.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import kr.lotto6.twa.data.generateNumbers

@Composable
fun GeneratorScreen(modifier: Modifier = Modifier) {
    var excluded by remember { mutableStateOf(setOf<Int>()) }
    var results by remember { mutableStateOf(listOf<List<Int>>()) }

    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        item {
            SurfaceCard {
                SectionTitle("제외할 번호")
                Text(
                    "선택한 번호는 생성에서 제외됩니다.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(top = 4.dp, bottom = 12.dp),
                )
                (1..45).chunked(7).forEach { row ->
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(vertical = 3.dp),
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                    ) {
                        row.forEach { n ->
                            val isExcluded = n in excluded
                            Box(
                                modifier = Modifier
                                    .size(38.dp)
                                    .background(
                                        if (isExcluded) MaterialTheme.colorScheme.primary
                                        else MaterialTheme.colorScheme.surfaceVariant,
                                        CircleShape,
                                    )
                                    .border(
                                        1.dp,
                                        if (isExcluded) MaterialTheme.colorScheme.primary
                                        else MaterialTheme.colorScheme.outline,
                                        CircleShape,
                                    )
                                    .clickable {
                                        excluded = if (isExcluded) excluded - n else excluded + n
                                    },
                                contentAlignment = Alignment.Center,
                            ) {
                                Text(
                                    text = n.toString(),
                                    color = if (isExcluded) MaterialTheme.colorScheme.onPrimary
                                    else MaterialTheme.colorScheme.onSurfaceVariant,
                                    fontWeight = FontWeight.Medium,
                                    style = MaterialTheme.typography.bodySmall,
                                )
                            }
                        }
                    }
                }
            }
        }

        item {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(
                    onClick = {
                        generateNumbers(excluded)?.let { results = (listOf(it) + results).take(10) }
                    },
                    enabled = 45 - excluded.size >= 6,
                    modifier = Modifier.weight(1f),
                ) { Text("번호 생성") }
                OutlinedButton(
                    onClick = { results = emptyList(); excluded = emptySet() },
                    modifier = Modifier.weight(1f),
                ) { Text("초기화") }
            }
        }

        if (results.isEmpty()) {
            item {
                Text(
                    "생성 버튼을 누르면 번호가 여기에 표시됩니다.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }

        items(results.size) { index ->
            SurfaceCard {
                Text(
                    "게임 ${results.size - index}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(bottom = 8.dp),
                )
                LottoBallRow(results[index], ballSize = 40.dp)
            }
        }
    }
}
