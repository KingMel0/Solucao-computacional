package com.cifra.app.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.cifra.app.data.daos.FinancialGoalDao
import com.cifra.app.data.daos.TransactionDao
import com.cifra.app.data.entities.FinancialGoal
import com.cifra.app.data.entities.Transaction

@Database(
    entities = [Transaction::class, FinancialGoal::class],
    version = 1,
    exportSchema = false
)
abstract class CifraDatabase : RoomDatabase() {
    abstract fun transactionDao(): TransactionDao
    abstract fun financialGoalDao(): FinancialGoalDao

    companion object {
        @Volatile
        private var INSTANCE: CifraDatabase? = null

        fun getDatabase(context: Context): CifraDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    CifraDatabase::class.java,
                    "cifra_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}