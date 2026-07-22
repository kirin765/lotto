package kr.lotto6.twa.data

import android.content.Context
import java.io.File

class AssetRoundStore(context: Context) : RoundStore {
    private val appContext = context.applicationContext
    private val extrasFile = File(appContext.filesDir, "rounds-extra.json")

    override fun readBundled(): String =
        appContext.assets.open("rounds.json").bufferedReader().use { it.readText() }

    override fun readExtras(): String? =
        if (extrasFile.exists()) runCatching { extrasFile.readText() }.getOrNull() else null

    override fun writeExtras(json: String) {
        runCatching { extrasFile.writeText(json) }
    }
}
