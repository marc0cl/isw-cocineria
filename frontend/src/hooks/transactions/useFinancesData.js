import { useState, useEffect } from 'react';
import { getIncomesService, getExpensesService } from '@services/transaction.service.js';
import { fetchProducts } from '@services/inventory.service.js';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export const useFinancesData = (selectedRange) => {
    const [pieData, setPieData] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [criticalProducts, setCriticalProducts] = useState([]);
    const [lineChartData, setLineChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [incomesData, incomesError] = await getIncomesService();
                if (incomesError) return console.error('Error al obtener ingresos:', incomesError);

                const [expensesData, expensesError] = await getExpensesService();
                if (expensesError) return console.error('Error al obtener gastos:', expensesError);

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
                const criticos = allProducts.data.filter(p => p.cantidadProducto <= p.minThreshold);
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
        const endDate = dayjs();
        const startDate = endDate.subtract(range - 1, 'day');

        const filteredIncomes = incomesData.filter(inc => {
            const date = dayjs(inc.createdAt);
            return date.isBetween(startDate, endDate, 'day', '[]');
        });

        const sourceDisplay = { bar: 'Bar', cocina: 'Cocina', otros: 'Otros' };

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
            if (sourceDisplay[src]) {
                daySourceMap[dayStr][src] += parseFloat(item.amount);
            } else {
                daySourceMap[dayStr].otros += parseFloat(item.amount);
            }
        });

        return Object.values(daySourceMap);
    };

    return { pieData, transactions, criticalProducts, lineChartData, loading };
};
