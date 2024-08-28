import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';

const SpitsyExpenseTracker = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [parties, setParties] = useState([
    { id: 'A', percentage: 50 },
    { id: 'B', percentage: 50 }
  ]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const total = parties.reduce((sum, party) => sum + party.percentage, 0);
    if (total !== 100) {
      const newParties = parties.map(party => ({
        ...party,
        percentage: (party.percentage / total) * 100
      }));
      setParties(newParties);
    }
  }, [parties]);

  const handleAddExpense = () => {
    if (description && amount > 0) {
      const newExpense = {
        description,
        amount: parseFloat(amount),
        splits: parties.map(party => ({
          id: party.id,
          amount: (parseFloat(amount) * party.percentage) / 100
        }))
      };
      setExpenses([...expenses, newExpense]);
      setDescription('');
      setAmount('');
    }
  };

  const handleAddParty = () => {
    const newPartyId = String.fromCharCode(65 + parties.length); // A, B, C, ...
    const newPercentage = 100 / (parties.length + 1);
    setParties(prevParties => [
      ...prevParties.map(party => ({ ...party, percentage: newPercentage })),
      { id: newPartyId, percentage: newPercentage }
    ]);
  };

  const handleRemoveParty = () => {
    if (parties.length > 2) {
      setParties(prevParties => {
        const updatedParties = prevParties.slice(0, -1);
        const newPercentage = 100 / updatedParties.length;
        return updatedParties.map(party => ({ ...party, percentage: newPercentage }));
      });
    }
  };

  const handlePercentageChange = (id, newPercentage) => {
    setParties(prevParties => {
      const updatedParties = prevParties.map(party =>
        party.id === id ? { ...party, percentage: newPercentage } : party
      );
      const total = updatedParties.reduce((sum, party) => sum + party.percentage, 0);
      return updatedParties.map(party => ({
        ...party,
        percentage: (party.percentage / total) * 100
      }));
    });
  };

  const totalAmount = parseFloat(amount) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-md bg-white shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
          <CardTitle className="text-center text-3xl font-bold">Splitsy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
            {parties.map((party) => (
              <div key={party.id} className="relative">
                <button
                  className="w-12 h-12 rounded-lg bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 text-lg font-bold flex items-center justify-center"
                >
                  {party.id}
                </button>
              </div>
            ))}
            <button
              className="w-12 h-12 rounded-lg bg-green-500 hover:bg-green-600 flex items-center justify-center text-white"
              onClick={handleAddParty}
            >
              <Plus className="h-6 w-6" />
            </button>
            <button
              className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white ml-2"
              onClick={handleRemoveParty}
            >
              <Minus className="h-6 w-6 font-bold" />
            </button>
          </div>

          <div className="space-y-4">
            <Input
              placeholder="Enter expense description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />

            <div className="relative">
              <DollarSign className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between mb-2 flex-wrap">
                  {parties.map((party) => (
                    <span key={party.id} className="text-sm font-medium text-gray-600">
                      {party.id}: ${((totalAmount * party.percentage) / 100).toFixed(2)}
                    </span>
                  ))}
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden flex">
                  {parties.map((party, index) => (
                    <motion.div
                      key={party.id}
                      className="h-full"
                      style={{
                        backgroundColor: `hsl(${index * (360 / parties.length)}, 70%, 60%)`,
                      }}
                      initial={{ width: `${100 / parties.length}%` }}
                      animate={{ width: `${party.percentage}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </div>
              {parties.map((party) => (
                <div key={party.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{party.id}:</span>
                    <span className="text-sm font-bold text-indigo-600">
                      {party.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Slider
                    value={[party.percentage]}
                    onValueChange={(values) => handlePercentageChange(party.id, values[0])}
                    max={100}
                    step={0.1}
                    className="flex-grow"
                  />
                </div>
              ))}
            </div>

            <Button onClick={handleAddExpense} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
              Add Expense
            </Button>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-sm font-medium text-gray-500">Expense</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-500">Amount</th>
                    {parties.map((party) => (
                      <th key={party.id} className="text-right py-2 text-sm font-medium text-gray-500">{party.id}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {expenses.map((expense, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="border-b border-gray-100"
                      >
                        <td className="py-2 text-sm text-gray-800">{expense.description}</td>
                        <td className="text-right py-2 text-sm text-gray-800">${expense.amount.toFixed(2)}</td>
                        {expense.splits.map((split) => (
                          <td key={split.id} className="text-right py-2 text-sm text-gray-800">${split.amount.toFixed(2)}</td>
                        ))}
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SpitsyExpenseTracker;
