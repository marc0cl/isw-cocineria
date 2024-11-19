import React, { useEffect, useState } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { getIncomesService, getExpensesService } from '@services/transaction.service.js';
import '@styles/finances.css';
import dayjs from 'dayjs'; // Librería para formatear fechas

const Finances = () => {
    const [pieData, setPieData] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [bestSellingProducts, setBestSellingProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // Obtener ingresos
            const [incomesData, incomesError] = await getIncomesService();
            if (incomesError) {
                console.error('Error al obtener ingresos:', incomesError);
                return;
            }

            // Obtener gastos
            const [expensesData, expensesError] = await getExpensesService();
            if (expensesError) {
                console.error('Error al obtener gastos:', expensesError);
                return;
            }

            // Combinar transacciones y ordenar por fecha descendente
            const allTransactions = [
                ...incomesData.map(item => ({ ...item, type: 'income' })),
                ...expensesData.map(item => ({ ...item, type: 'expense' })),
            ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setTransactions(allTransactions);

            // Calcular totales para el gráfico de torta
            const incomeTotal = incomesData.reduce((sum, item) => sum + parseFloat(item.amount), 0);
            const expenseTotal = expensesData.reduce((sum, item) => sum + parseFloat(item.amount), 0);

            setPieData([
                { name: 'Ingresos', value: incomeTotal },
                { name: 'Gastos', value: expenseTotal },
            ]);

            // Calcular productos más vendidos
            const productSales = {};
            incomesData.forEach(item => {
                const productName = item.description;
                if (productSales[productName]) {
                    productSales[productName] += 1;
                } else {
                    productSales[productName] = 1;
                }
            });

            const bestSellers = Object.keys(productSales).map(product => ({
                name: product,
                sales: productSales[product],
            }));

            setBestSellingProducts(bestSellers);
        };

        fetchData();
    }, []);

    const COLORS = ['#00C49F', '#FF0000']; // Verde para ingresos, rojo para gastos

    return (
        <div className="finances-container">
            <div className="charts-container">
                {/* Gráfico de torta */}
                <div className="chart-item">
                    <h2>Ingresos vs Gastos</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={130}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Lista de transacciones */}
                <div className="chart-item transactions-container">
                    <h2>Transacciones</h2>
                    <ul className="transactions-list">
                        {transactions.map((t, index) => (
                            <li key={index} className={t.type === 'income' ? 'income' : 'expense'}>
                <span className="transaction-date">
                  {dayjs(t.createdAt).format('DD/MM/YYYY')}
                </span>
                                <span className="transaction-description">
                  {t.description} - ${parseFloat(t.amount).toFixed(2)}
                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Productos más vendidos */}
                <div className="chart-item">
                    <h2>Productos más vendidos</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={bestSellingProducts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="sales" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Finances;
