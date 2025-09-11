package com.cifra.app.di

import android.content.Context
import com.cifra.app.data.CifraDatabase
import com.cifra.app.data.repositories.FinancialGoalRepository
import com.cifra.app.data.repositories.TransactionRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    @Singleton
    @Provides
    fun provideCifraDatabase(@ApplicationContext context: Context): CifraDatabase {
        return CifraDatabase.getDatabase(context)
    }

    @Singleton
    @Provides
    fun provideTransactionRepository(database: CifraDatabase) =
        TransactionRepository(database.transactionDao())

    @Singleton
    @Provides
    fun provideFinancialGoalRepository(database: CifraDatabase) =
        FinancialGoalRepository(database.financialGoalDao())
}