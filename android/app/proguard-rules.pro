# kotlinx.serialization ships consumer rules; @Serializable 클래스만 이름 보존을 보장한다.
-keepclassmembers class kr.lotto6.twa.data.** {
    *** Companion;
}
-keepclasseswithmembers class kr.lotto6.twa.data.** {
    kotlinx.serialization.KSerializer serializer(...);
}
