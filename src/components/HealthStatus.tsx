import React, { useState, useEffect } from 'react';
import { healthCheck } from '@/services/apiService';
import type { HealthCheckResponse } from '@/types';

const HealthStatus: React.FC = () => {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        setLoading(true);
        const response = await healthCheck();
        console.log('Health check response:', response); // Debug log
        // The response might already be the data, not wrapped in a data property
        if (response && typeof response === 'object' && 'success' in response) {
          setHealth(response as unknown as HealthCheckResponse);
        } else if (response && typeof response === 'object' && 'data' in response) {
          setHealth(response.data);
        } else {
          setError('Invalid health data format');
        }
        setError(null);
      } catch (err: unknown) {
        const error = err as Error;
        setError('Failed to fetch health status: ' + (error.message || 'Unknown error'));
        console.error('Health check error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  if (loading) {
    return <div className="health-status loading">Checking health...</div>;
  }

  if (error) {
    return <div className="health-status error">{error}</div>;
  }

  if (!health) {
    return <div className="health-status error">No health data available</div>;
  }

  return (
    <div className="health-status">
      <div className={`status-indicator ${health.success ? 'success' : 'error'}`}>
        <span className="status-dot"></span>
        <span className="status-text">
          {health.success ? 'API is healthy' : 'API has issues'}
        </span>
      </div>
      <div className="status-details">
        <p><strong>Environment:</strong> {health.environment || 'N/A'}</p>
        <p><strong>Uptime:</strong> {health.uptime ? Math.floor(health.uptime / 60) : 'N/A'} minutes</p>
        <p><strong>Last checked:</strong> {health.timestamp ? new Date(health.timestamp).toLocaleString() : 'N/A'}</p>
      </div>
    </div>
  );
};

export default HealthStatus;