import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.2.96:3000/api';

interface Budget {
  id: number;
  eventId: number;
  totalAmount: number;
  status: string;
  event: {
    name: string;
  };
  categories: Array<{
    id: number;
    name: string;
    allocatedAmount: number;
    spent: number;
  }>;
}

export default function BudgetScreen() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get(`${API_URL}/budgets`);
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBudgets();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.categories.reduce((s, c) => s + c.spent, 0), 0);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Budget</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Budget total</Text>
          <Text style={styles.summaryValue}>{(totalBudget / 1000).toFixed(0)}k FCFA</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Dépensé</Text>
          <Text style={[styles.summaryValue, { color: '#ef4444' }]}>{(totalSpent / 1000).toFixed(0)}k FCFA</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Disponible</Text>
          <Text style={[styles.summaryValue, { color: '#22c55e' }]}>{((totalBudget - totalSpent) / 1000).toFixed(0)}k FCFA</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budgets par événement</Text>
        {budgets.length === 0 ? (
          <Text style={styles.emptyText}>Aucun budget</Text>
        ) : (
          budgets.map((budget) => (
            <View key={budget.id} style={styles.budgetCard}>
              <View style={styles.budgetHeader}>
                <Text style={styles.budgetName}>{budget.event.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: budget.status === 'Approuvé' ? '#dcfce7' : '#fef3c7' }]}>
                  <Text style={[styles.statusText, { color: budget.status === 'Approuvé' ? '#16a34a' : '#b45309' }]}>
                    {budget.status}
                  </Text>
                </View>
              </View>

              <View style={styles.budgetAmount}>
                <Text style={styles.amountLabel}>Montant total</Text>
                <Text style={styles.amountValue}>{(budget.totalAmount / 1000).toFixed(0)}k FCFA</Text>
              </View>

              <View style={styles.categoriesContainer}>
                {budget.categories.map((category) => {
                  const percentage = (category.spent / category.allocatedAmount) * 100;
                  return (
                    <View key={category.id} style={styles.categoryItem}>
                      <View style={styles.categoryHeader}>
                        <Text style={styles.categoryName}>{category.name}</Text>
                        <Text style={styles.categoryAmount}>{(category.spent / 1000).toFixed(0)}k / {(category.allocatedAmount / 1000).toFixed(0)}k</Text>
                      </View>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${Math.min(percentage, 100)}%`,
                              backgroundColor: percentage > 85 ? '#ef4444' : '#f97316',
                            },
                          ]}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  summaryCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f97316',
  },
  divider: {
    width: 1,
    backgroundColor: '#e2e8f0',
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  budgetCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  budgetAmount: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  amountLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryItem: {
    gap: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  categoryAmount: {
    fontSize: 12,
    color: '#64748b',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  emptyText: {
    color: '#94a3b8',
    textAlign: 'center',
    paddingVertical: 40,
  },
});
