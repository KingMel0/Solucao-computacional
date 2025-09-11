package com.cifra.app.data.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverters
import com.cifra.app.data.converters.DateConverter
import java.util.Date

@Entity(tableName = "transactions")
@TypeConverters(DateConverter::class)
data class Transaction(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val type: String, // "income" ou "expense"
    val amount: Double,
    val category: String,
    val description: String,
    val date: Date,
    val createdAt: Date = Date()
)