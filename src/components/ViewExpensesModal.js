import { Button, Modal, Stack } from 'react-bootstrap';
import { FiDownload, FiTrash2 } from 'react-icons/fi';
import {
	UNCATEGORIZED_BUDGET_ID,
	useBudgets,
} from '../contexts/BudgetsContext';
import { currencyFormatter } from '../utils';

export default function ViewExpensesModal({
	budgetId,
	handleClose,
	downloadExpense,
}) {
	const { getBudgetExpenses, budgets, deleteBudget, deleteExpense } =
		useBudgets();

	const expenses = getBudgetExpenses(budgetId);
	const budget =
		UNCATEGORIZED_BUDGET_ID === budgetId
			? { name: 'Uncategorized', id: UNCATEGORIZED_BUDGET_ID }
			: budgets.find((b) => b.id === budgetId);

	// write a function to download the expenses to a csv file
	function downloadExpense(expenses) {
		const csvRows = [];
		const headers = Object.keys(expenses[0]);
		csvRows.push(headers.join(','));
		for (const row of expenses) {
			const values = headers.map((header) => {
				const escaped = ('' + row[header]).replace(/"/g, '\\"');
				return `"${escaped}"`;
			});
			csvRows.push(values.join(','));
		}
		const csvString = csvRows.join('\n');
		const a = document.createElement('a');
		a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);
		a.setAttribute('download', `${budget?.name}.csv`);
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	return (
		<Modal show={budgetId != null} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>
					<Stack direction='horizontal' gap='2'>
						<div>Expenses - {budget?.name}</div>
						{budgetId !== UNCATEGORIZED_BUDGET_ID && (
							<Button
								// onclick use the downloadExpense function
								onClick={() => downloadExpense(expenses)}
								variant='outline-danger'
							>
								<FiTrash2 />
							</Button>
						)}
						<Button
							// Write a function to download the expenses to a csv file
							onClick={() => downloadExpense(expenses)}
							variant='outline-success'
						>
							<FiDownload />
						</Button>
					</Stack>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Stack direction='vertical' gap='3'>
					{expenses.map((expense) => (
						<Stack direction='horizontal' gap='2' key={expense.id}>
							<div className='me-auto fs-4'>{expense.description}</div>
							<div className='fs-5'>
								{currencyFormatter.format(expense.amount)}
							</div>
							<Button
								onClick={() => deleteExpense(expense)}
								size='sm'
								variant='outline-danger'
							>
								<FiTrash2 />
							</Button>
						</Stack>
					))}
				</Stack>
			</Modal.Body>
		</Modal>
	);
}
