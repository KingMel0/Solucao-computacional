package com.cifra.app.data.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverters
import com.cifra.app.data.converters.DateConverter
import java.util.Date

@Entity(tableName = "financial_goals")
@TypeConverters(DateConverter::class)
data class FinancialGoal(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val title: String,
    val targetAmount: Double,
    val currentAmount: Double = 0.0,
    val deadline: Date,
    val completed: Boolean = false,
    val createdAt: Date = Date()
)