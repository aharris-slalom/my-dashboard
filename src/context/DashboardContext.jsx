import React, { createContext, useContext, useState, useEffect } from 'react';
import mockData from '../data/mockData.json';
import useHeartbeat from '../hooks/useHeartbeat';

const DashboardContext = createContext({
  departments: [],
  shipments: [],
  excursionCounter: [],
  isAuditMode: false,
  setIsAuditMode: () => {},
  totalValueAtRisk: 0,
  theme: 'dark',
  setTheme: () => {},
});

export function DashboardProvider({ children }) {
  const { departments, shipments, excursionCounter } = useHeartbeat(mockData.departments, mockData.in_transit_shipments);
  const [isAuditMode, setIsAuditMode] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const totalValueAtRisk = departments.reduce((deptAcc, department) => {
    return deptAcc + department.units.reduce((unitAcc, unit) => {
      return unitAcc + (unit.status === 'Critical' ? unit.assetValue : 0);
    }, 0);
  }, 0);

  return (
    <DashboardContext.Provider
      value={{
        departments,
        shipments,
        excursionCounter,
        isAuditMode,
        setIsAuditMode,
        totalValueAtRisk,
        theme,
        setTheme,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}
