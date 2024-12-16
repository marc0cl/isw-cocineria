import { useEffect, useState } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, Legend,
    LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { getIncomesService, getExpensesService } from '@services/transaction.service.js';
import { fetchProducts } from '@services/inventory.service.js';
import '@styles/finances.css';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import Spinner from '../components/Login/Spinner.jsx';
dayjs.extend(isBetween);

const Finances = () => {
    const [pieData, setPieData] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [criticalProducts, setCriticalProducts] = useState([]);
    const [lineChartData, setLineChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRange, setSelectedRange] = useState(7);

    const COLORS = ['#00C49F', '#FF0000']; // Verde para ingresos, rojo para gastos

    const sourceDisplay = {
        bar: 'Bar',
        cocina: 'Cocina',
        otros: 'Otros',
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
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

                // Calcular totales y transacciones
                const allTransactions = [
                    ...incomesData.map(item => ({ ...item, type: 'income' })),
                    ...expensesData.map(item => ({ ...item, type: 'expense' })),
                ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setTransactions(allTransactions);

                const incomeTotal = incomesData.reduce((sum, item) => sum + parseFloat(item.amount), 0);
                const expenseTotal = expensesData.reduce((sum, item) => sum + parseFloat(item.amount), 0);

                setPieData([
                    { name: 'Ingresos', value: incomeTotal },
                    { name: 'Gastos', value: expenseTotal },
                ]);

                const allProducts = await fetchProducts();
                const criticos = allProducts.data.filter(p => p.cantidadProducto < p.minThreshold);
                setCriticalProducts(criticos);

                const lineData = prepareLineChartData(incomesData, selectedRange);
                setLineChartData(lineData);

                setLoading(false);
            } catch (error) {
                console.error("Error en fetchData:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedRange]);


    const prepareLineChartData = (incomesData, range) => {
        // Obtenemos la fecha actual
        const endDate = dayjs();
        // Fecha inicial basada en el rango
        const startDate = endDate.subtract(range - 1, 'day');

        // Filtrar ingresos dentro del rango
        const filteredIncomes = incomesData.filter(inc => {
            const date = dayjs(inc.createdAt);
            return date.isBetween(startDate, endDate, 'day', '[]');
        });

        // Agrupar por día y fuente
        const daySourceMap = {};
        for (let i = 0; i < range; i++) {
            const currentDay = startDate.add(i, 'day');
            const dayStr = currentDay.format('DD/MM');
            daySourceMap[dayStr] = { day: dayStr, bar: 0, cocina: 0, otros: 0 };
        }

        filteredIncomes.forEach(item => {
            const dayStr = dayjs(item.createdAt).format('DD/MM');
            const src = item.source || 'otros';
            if (!daySourceMap[dayStr]) {
                daySourceMap[dayStr] = { day: dayStr, bar: 0, cocina: 0, otros: 0 };
            }
            // Sumar montos por fuente
            if (sourceDisplay[src]) {
                daySourceMap[dayStr][src] += parseFloat(item.amount);
            } else {
                daySourceMap[dayStr]['otros'] += parseFloat(item.amount);
            }
        });

        return Object.values(daySourceMap);
    };

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
                <div className="chart-item pie-chart-container">
                    <h2>Ingresos vs Gastos</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={120}
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
                <div className="chart-item tablef-container">

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
                                    <td>{sourceDisplay[t.source] || 'Otros'}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {criticalProducts && criticalProducts.length > 0 && (
                    <div className="chart-item table-container">
                        <h2>Productos Críticos</h2>
                        <div className="transactions-container">
                            <table className="transactions-table">
                                <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad Actual</th>
                                    <th>Mínimo Permitido</th>
                                    <th>Unidad</th>
                                    <th>Proveedor</th>
                                </tr>
                                </thead>
                                <tbody>
                                {criticalProducts.map((prod, idx) => (
                                    <tr key={idx}>
                                        <td>{prod.nombreProducto}</td>
                                        <td>{prod.cantidadProducto}</td>
                                        <td>{prod.minThreshold}</td>
                                        <td>{prod.stockUnit}</td>
                                        <td>{prod.supplierName || 'N/A'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="chart-item">
                    <h2>Ventas por Fuente (últimos {selectedRange} días)</h2>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Rango de días: </label>
                        <select value={selectedRange} onChange={e => setSelectedRange(parseInt(e.target.value))}>
                            <option value={7}>7 días</option>
                            <option value={14}>14 días</option>
                            <option value={30}>30 días</option>
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={lineChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="bar" stroke="#82ca9d" name="Bar" />
                            <Line type="monotone" dataKey="cocina" stroke="#8884d8" name="Cocina" />
                            <Line type="monotone" dataKey="otros" stroke="#FF0000" name="Otros" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Finances;
