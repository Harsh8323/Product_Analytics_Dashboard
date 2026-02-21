import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePersistedFilters } from '../hooks/usePersistedFilters';
import { getBarChartData, getLineChartData } from '../services/analyticsService';
import { trackClick } from '../services/trackService';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import Skeleton from '../components/ui/Skeleton';

const DashboardPage = () => {
  const { user } = useAuth();
  const { filters, updateFilters } = usePersistedFilters();
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [loadingBar, setLoadingBar] = useState(false);
  const [loadingLine, setLoadingLine] = useState(false);

  const ageOptions = [
    { value: '', label: 'All Ages' },
    { value: '<18', label: '<18' },
    { value: '18-40', label: '18-40' },
    { value: '>40', label: '>40' },
  ];
  const genderOptions = [
    { value: '', label: 'All Genders' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  // Fetch bar chart data when filters change
  useEffect(() => {
    const fetchBarData = async () => {
      setLoadingBar(true);
      try {
        const params = {};
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;
        if (filters.ageGroup) params.ageGroup = filters.ageGroup;
        if (filters.gender) params.gender = filters.gender;
        const { data } = await getBarChartData(params);
        setBarData(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingBar(false);
      }
    };
    fetchBarData();
  }, [filters]);

  // Fetch line chart data when selected feature or filters change
  useEffect(() => {
    if (!selectedFeature) return;
    const fetchLineData = async () => {
      setLoadingLine(true);
      try {
        const params = {};
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;
        if (filters.ageGroup) params.ageGroup = filters.ageGroup;
        if (filters.gender) params.gender = filters.gender;
        const { data } = await getLineChartData(selectedFeature, params);
        setLineData(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingLine(false);
      }
    };
    fetchLineData();
  }, [selectedFeature, filters]);

  const filterTrackNames = {
    startDate: 'date_filter',
    endDate: 'date_filter',
    ageGroup: 'age_filter',
    gender: 'gender_filter',
  };

  const handleFilterChange = (key, value) => {
    updateFilters({ [key]: value });
    trackClick(filterTrackNames[key]).catch(console.error);
  };

  const handleBarClick = (data) => {
    if (!data || !data.feature_name) return;
    setSelectedFeature(data.feature_name);
    trackClick('bar_chart_zoom').catch(console.error);
  };

  const handleLineClick = () => {
    trackClick('line_chart_click').catch(console.error);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-20">
        <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
        
        {/* Filters */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Age Group</label>
              <Select
                options={ageOptions}
                value={filters.ageGroup}
                onChange={(val) => handleFilterChange('ageGroup', val)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <Select
                options={genderOptions}
                value={filters.gender}
                onChange={(val) => handleFilterChange('gender', val)}
              />
            </div>
          </div>
        </Card>

        {/* Bar Chart */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Feature Usage (Total Clicks)</h2>
          {loadingBar ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <BarChart data={barData} onBarClick={handleBarClick} />
          )}
        </Card>

        {/* Line Chart */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">
            Time Trend {selectedFeature ? `for ${selectedFeature}` : '(Click a bar to select feature)'}
          </h2>
          {loadingLine ? (
            <Skeleton className="h-[300px] w-full" />
          ) : selectedFeature ? (
            <LineChart data={lineData} onLineClick={handleLineClick} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Click on a bar in the chart above to see daily trend
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;