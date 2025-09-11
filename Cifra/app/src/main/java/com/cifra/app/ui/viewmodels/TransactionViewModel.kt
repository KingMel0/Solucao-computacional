package com.cifra.app.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.cifra.app.data.entities.Transaction
import com.cifra.app.data.repositories.TransactionRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch
import java.util.Date
import javax.inject.Inject

@HiltViewModel
class TransactionViewModel @Inject constructor(
    private val repository: TransactionRepository
) : ViewModel() {

    private val _transactions = MutableStateFlow<List<Transaction>>(emptyList())
    val transactions: StateFlow<List<Transaction>> = _transactions

    private val _totalIncome = MutableStateFlow(0.0)
    val totalIncome: StateFlow<Double> = _totalIncome

    private val _totalExpenses = MutableStateFlow(0.0)
    val totalExpenses: StateFlow<Double> = _totalExpenses

    private val _balance = MutableStateFlow(0.0)
    val balance: StateFlow<Double> = _balance

    init {
        loadTransactions()
        loadTotals()
    }

    private fun loadTransactions() {
        viewModelScope.launch {
            repository.getAllTransactions().collect { transactions ->
                _transactions.value = transactions
                calculateBalance()
            }
        }
    }

    private fun loadTotals() {
        viewModelScope.launch {
            repository.getTotalIncome().collect { income ->
                _totalIncome.value = income
                calculateBalance()
            }
            repository.getTotalExpenses().collect { expenses ->
                _totalExpenses.value = expenses
                calculateBalance()
            }
        }
    }

    private fun calculateBalance() {
        _balance.value = _totalIncome.value - _totalExpenses.value
    }

    fun addTransaction(transaction: Transaction) {
        viewModelScope.launch {
            repository.insertTransaction(transaction)
        }
    }

    fun updateTransaction(transaction: Transaction) {
        viewModelScope.launch {
            repository.updateTransaction(transaction)
        }
    }

    fun deleteTransaction(transaction: Transaction) {
        viewModelScope.launch {
            repository.deleteTransaction(transaction)
        }
    }

    fun getTransactionsByType(type: String) {
        viewModelScope.launch {
            repository.getTransactionsByType(type).collect { transactions ->
                _transactions.value = transactions
            }
        }
    }

    fun getTransactionsBetweenDates(startDate: Date, endDate: Date) {
        viewModelScope.launch {
            repository.getTransactionsBetweenDates(startDate, endDate).collect { transactions ->
                _transactions.value = transactions
            }
        }
    }
}