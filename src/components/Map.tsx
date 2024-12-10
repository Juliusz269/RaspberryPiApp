// components/Map.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { VehiclePosition } from '../types';

interface MapProps {
  mapData: number[][] | null;
  position: VehiclePosition;
}

export function Map({ mapData, position }: MapProps) {
  if (!mapData) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Generating map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Simple 2D grid representation of the map */}
      <View style={styles.mapGrid}>
        {mapData.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.mapRow}>
            {row.map((cell, cellIndex) => (
              <View
                key={cellIndex}
                style={[
                  styles.mapCell,
                  {
                    backgroundColor: cell === 1 ? '#007AFF' : 'transparent',
                    // Highlight current position
                    borderColor: 
                      rowIndex === Math.floor(position.y) && 
                      cellIndex === Math.floor(position.x)
                        ? '#FF3B30'
                        : 'transparent',
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </View>

      {/* Position information */}
      <View style={styles.positionInfo}>
        <Text style={styles.positionText}>
          Position: ({position.x.toFixed(1)}, {position.y.toFixed(1)})
        </Text>
        <Text style={styles.positionText}>
          Orientation: {position.orientation.toFixed(1)}°
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapGrid: {
    flex: 1,
    padding: 16,
  },
  mapRow: {
    flexDirection: 'row',
  },
  mapCell: {
    width: 4,
    height: 4,
    borderWidth: 1,
  },
  positionInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 8,
  },
  positionText: {
    color: '#fff',
    fontSize: 12,
  },
  message: {
    color: '#666',
    fontSize: 16,
  },
});