package com.cifra.app.data.repositories

import com.cifra.app.data.daos.TransactionDao
import com.cifra.app.data.entities.Transaction
import kotlinx.coroutines.flow.Flow
import java.util.Date
import javax.inject.Inject

class TransactionRepository @Inject constructor(private val transactionDao: TransactionDao) {
    suspend fun insertTransaction(transaction: Transaction): Long {
        return transactionDao.insert(transaction)
    }

    suspend fun updateTransaction(transaction: Transaction) {
        transactionDao.update(transaction)
    }

    suspend fun deleteTransaction(transaction: Transaction) {
        transactionDao.delete(transaction)
    }

    fun getAllTransactions(): Flow<List<Transaction>> {
        return transactionDao.getAllTransactions()
    }

    fun getTransactionsByType(type: String): Flow<List<Transaction>> {
        return transactionDao.getTransactionsByType(type)
    }

    fun getTotalIncome(): Flow<Double> {
        return transactionDao.getTotalIncome()
    }

    fun getTotalExpenses(): Flow<Double> {
        return transactionDao.getTotalExpenses()
    }

    fun getTransactionsBetweenDates(startDate: Date, endDate: Date): Flow<List<Transaction>> {
        return transactionDao.getTransactionsBetweenDates(startDate, endDate)
    }
}