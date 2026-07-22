package kr.lotto6.twa

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import kr.lotto6.twa.data.AssetRoundStore
import kr.lotto6.twa.data.LottoRound
import kr.lotto6.twa.data.RoundRepository

data class LottoUiState(
    val rounds: List<LottoRound> = emptyList(),
    val loading: Boolean = true,
    val refreshing: Boolean = false,
    val selectedRound: Int? = null,
) {
    val latest: LottoRound? get() = rounds.firstOrNull()
    val current: LottoRound?
        get() = selectedRound?.let { no -> rounds.firstOrNull { it.roundNo == no } } ?: latest
}

class MainViewModel(app: Application) : AndroidViewModel(app) {

    private val repository = RoundRepository(AssetRoundStore(app))

    private val _state = MutableStateFlow(LottoUiState())
    val state: StateFlow<LottoUiState> = _state.asStateFlow()

    init {
        viewModelScope.launch {
            val rounds = withContext(Dispatchers.IO) { repository.load() }
            _state.update { it.copy(rounds = rounds, loading = false) }
            refresh()
        }
    }

    fun refresh() {
        if (_state.value.refreshing) return
        viewModelScope.launch {
            _state.update { it.copy(refreshing = true) }
            val changed = withContext(Dispatchers.IO) { repository.refresh() }
            val rounds = if (changed) repository.all() else _state.value.rounds
            _state.update { it.copy(rounds = rounds, refreshing = false) }
        }
    }

    fun selectRound(roundNo: Int?) {
        _state.update { it.copy(selectedRound = roundNo) }
    }
}
