import { useEffect, useState } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { getIncomesService, getExpensesService } from '@services/transaction.service.js';
import '@styles/finances.css';
import dayjs from 'dayjs';
import Spinner from '../components/Login/Spinner.jsx';

const Finances = () => {
    const [pieData, setPieData] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [bestSellingProducts, setBestSellingProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const sourceDisplay = {
        bar: 'Bar',
        cocina: 'Cocina',
        otro: 'Otro',
    };

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
                productSales[productName] = (productSales[productName] || 0) + 1;
            });

            const bestSellers = Object.keys(productSales).map(product => ({
                name: product,
                cantidad: productSales[product],
            }));

            setBestSellingProducts(bestSellers);

            setLoading(false);
        };

        fetchData();
    }, []);

    const COLORS = ['#00C49F', '#FF0000']; // Verde para ingresos, rojo para gastos

    if (loading) {
        return (
            <div className="finances-loading-container">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="finances-container">
            <div className="charts-container">
                {/* Gráfico de torta */}
                <div className="chart-item pie-chart-container">
                    <h2>Ingresos vs Gastos</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                //label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={120} // Se reduce para evitar cortar textos
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

                {/* Sección de Transacciones */}
                <div className="chart-item table-container">
                    <h2>Transacciones</h2>
                    <div className="transactions-container">
                        <table className="transactions-table">
                            <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Descripción</th>
                                <th>Monto</th>
                                <th>Origen</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.map((t, index) => (
                                <tr key={index}>
                                    <td>{dayjs(t.createdAt).format('DD/MM/YYYY')}</td>
                                    <td>{t.description}</td>
                                    <td className={`amount ${t.type === 'income' ? 'income' : 'expense'}`}>
                                        ${parseFloat(t.amount).toFixed(2)}
                                    </td>
                                    <td>{sourceDisplay[t.source] || t.source}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Productos más vendidos */}
                <div className="chart-item">
                    <h2>Productos más vendidos</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={bestSellingProducts}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="cantidad" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Finances;
