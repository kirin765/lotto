package kr.lotto6.twa.ui

import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Casino
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.InsertChart
import androidx.compose.material.icons.filled.ListAlt
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import kr.lotto6.twa.LottoUiState

private data class Tab(val label: String, val icon: ImageVector)

private val TABS = listOf(
    Tab("당첨번호", Icons.Filled.EmojiEvents),
    Tab("통계", Icons.Filled.InsertChart),
    Tab("생성기", Icons.Filled.Casino),
    Tab("이력", Icons.Filled.ListAlt),
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LottoApp(
    state: LottoUiState,
    onRefresh: () -> Unit,
    onSelectRound: (Int?) -> Unit,
) {
    var tab by remember { mutableIntStateOf(0) }
    val current = state.current

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "로또 당첨번호 645",
                        fontWeight = FontWeight.Bold,
                        style = MaterialTheme.typography.titleMedium,
                    )
                },
                actions = {
                    if (state.refreshing) {
                        CircularProgressIndicator(
                            modifier = Modifier.padding(end = 16.dp).size(20.dp),
                            strokeWidth = 2.dp,
                        )
                    } else {
                        IconButton(onClick = onRefresh) {
                            Icon(Icons.Filled.Refresh, contentDescription = "새로고침")
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background,
                    titleContentColor = MaterialTheme.colorScheme.onBackground,
                ),
            )
        },
        bottomBar = {
            NavigationBar(containerColor = MaterialTheme.colorScheme.background) {
                TABS.forEachIndexed { index, item ->
                    NavigationBarItem(
                        selected = tab == index,
                        onClick = { tab = index },
                        icon = { Icon(item.icon, contentDescription = item.label) },
                        label = { Text(item.label) },
                    )
                }
            }
        },
    ) { padding ->
        val contentModifier = Modifier.padding(padding)
        when (tab) {
            0 -> HomeScreen(
                round = current,
                isLatest = current != null && current.roundNo == state.latest?.roundNo,
                loading = state.loading,
                onSelectRound = onSelectRound,
                modifier = contentModifier,
            )
            1 -> StatsScreen(rounds = state.rounds, modifier = contentModifier)
            2 -> GeneratorScreen(modifier = contentModifier)
            else -> HistoryScreen(
                rounds = state.rounds,
                onSelectRound = { roundNo ->
                    onSelectRound(roundNo)
                    tab = 0
                },
                modifier = contentModifier,
            )
        }
    }
}
