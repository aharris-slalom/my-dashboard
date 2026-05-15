import { useEffect, useState } from 'react';

const DEFAULT_SPEED = 3000;
const SIMULATION_SPEED = Number(import.meta.env.VITE_SIMULATION_SPEED) || DEFAULT_SPEED;
const TEMP_STEP = 0.1;
const OUT_OF_RANGE_CRITICAL_SECONDS = 10;

const isTempInRange = (temperature, min, max) => temperature >= min && temperature <= max;

const calculateTotalValueAtRisk = (departments) => {
  return departments.reduce((deptAcc, department) => {
    return deptAcc + department.units.reduce((unitAcc, unit) => {
      return unitAcc + (unit.status === 'Critical' ? unit.assetValue : 0);
    }, 0);
  }, 0);
};

const getNextStatus = (unit, nextTemp, elapsedSeconds) => {
  const inRange = isTempInRange(nextTemp, unit.minTemp, unit.maxTemp);
  if (inRange) {
    return {
      status: 'Optimal',
      timeOutOfRangeSeconds: 0,
    };
  }

  const nextOutOfRangeSeconds = (unit.timeOutOfRangeSeconds || 0) + elapsedSeconds;
  return {
    status: nextOutOfRangeSeconds > OUT_OF_RANGE_CRITICAL_SECONDS ? 'Critical' : 'Warning',
    timeOutOfRangeSeconds: nextOutOfRangeSeconds,
  };
};

const randomTempDelta = () => {
  return Math.random() < 0.5 ? -TEMP_STEP : TEMP_STEP;
};

const moveShipment = (shipment) => {
  const deltaX = (Math.random() - 0.5) * 10; // small movement
  const deltaY = (Math.random() - 0.5) * 10;
  return {
    ...shipment,
    x: Math.max(0, Math.min(600, shipment.x + deltaX)), // keep within bounds
    y: Math.max(0, Math.min(400, shipment.y + deltaY)),
  };
};

export default function useHeartbeat(initialDepartments, initialShipments) {
  const [departments, setDepartments] = useState(initialDepartments);
  const [shipments, setShipments] = useState(initialShipments);
  const [excursionCounter, setExcursionCounter] = useState(
    Array.from({ length: 24 }, (_, index) => ({ hour: `${index}:00`, excursions: 0 })),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const currentHour = new Date().getHours();
      let newExcursions = 0;

      setDepartments((currentDepartments) => {
        const updatedDepartments = currentDepartments.map((department) => {
          return {
            ...department,
            units: department.units.map((unit) => {
              const nextTemp = Number((unit.currentTemp + randomTempDelta()).toFixed(1));
              const { status, timeOutOfRangeSeconds } = getNextStatus(unit, nextTemp, SIMULATION_SPEED / 1000);

              const isNewExcursion = status !== unit.status && (status === 'Warning' || status === 'Critical');
              if (isNewExcursion) {
                newExcursions += 1;
              }

              return {
                ...unit,
                currentTemp: nextTemp,
                status,
                timeOutOfRangeSeconds,
                logs: [
                  {
                    timestamp: new Date().toISOString(),
                    temperature: nextTemp,
                    note: status === 'Optimal' ? 'Stable' : status === 'Warning' ? 'Excursion detected' : 'Critical excursion',
                  },
                  ...(unit.logs ? unit.logs.slice(0, 9) : []),
                ],
              };
            }),
          };
        });

        const totalValueAtRisk = calculateTotalValueAtRisk(updatedDepartments);
        console.log(`Heartbeat tick: Total Value at Risk = $${totalValueAtRisk.toLocaleString()}`);
        return updatedDepartments;
      });

      if (newExcursions > 0) {
        setExcursionCounter((currentCounter) =>
          currentCounter.map((bin, index) =>
            index === currentHour ? { ...bin, excursions: bin.excursions + newExcursions } : bin,
          ),
        );
      }

      setShipments((currentShipments) => currentShipments.map(moveShipment));
    }, SIMULATION_SPEED);

    return () => clearInterval(interval);
  }, []);

  return { departments, shipments, excursionCounter };
}
