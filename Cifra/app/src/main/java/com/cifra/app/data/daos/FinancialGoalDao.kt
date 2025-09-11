package com.cifra.app.data.daos

import androidx.room.*
import com.cifra.app.data.entities.FinancialGoal
import kotlinx.coroutines.flow.Flow

@Dao
interface FinancialGoalDao {
    @Insert
    suspend fun insert(goal: FinancialGoal): Long

    @Update
    suspend fun update(goal: FinancialGoal)

    @Delete
    suspend fun delete(goal: FinancialGoal)

    @Query("SELECT * FROM financial_goals ORDER BY deadline ASC")
    fun getAllGoals(): Flow<List<FinancialGoal>>

    @Query("SELECT * FROM financial_goals WHERE completed = 0 ORDER BY deadline ASC")
    fun getActiveGoals(): Flow<List<FinancialGoal>>
}