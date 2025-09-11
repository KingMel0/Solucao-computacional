package com.cifra.app.data.repositories

import com.cifra.app.data.daos.FinancialGoalDao
import com.cifra.app.data.entities.FinancialGoal
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class FinancialGoalRepository @Inject constructor(private val financialGoalDao: FinancialGoalDao) {
    suspend fun insertGoal(goal: FinancialGoal): Long {
        return financialGoalDao.insert(goal)
    }

    suspend fun updateGoal(goal: FinancialGoal) {
        financialGoalDao.update(goal)
    }

    suspend fun deleteGoal(goal: FinancialGoal) {
        financialGoalDao.delete(goal)
    }

    fun getAllGoals(): Flow<List<FinancialGoal>> {
        return financialGoalDao.getAllGoals()
    }

    fun getActiveGoals(): Flow<List<FinancialGoal>> {
        return financialGoalDao.getActiveGoals()
    }
}