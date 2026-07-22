package kr.lotto6.twa

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.runtime.getValue
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import kr.lotto6.twa.ui.LottoApp
import kr.lotto6.twa.ui.LottoTheme

class MainActivity : ComponentActivity() {

    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            LottoTheme {
                val state by viewModel.state.collectAsStateWithLifecycle()
                LottoApp(
                    state = state,
                    onRefresh = viewModel::refresh,
                    onSelectRound = viewModel::selectRound,
                )
            }
        }
    }
}
