import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LineChart = ({ data, onLineClick }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} onClick={onLineClick} style={{ cursor: 'pointer' }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="date" stroke="var(--muted-foreground)" />
        <YAxis stroke="var(--muted-foreground)" />
        <Tooltip
          contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', color: 'var(--popover-foreground)' }}
        />
        <Line type="monotone" dataKey="count" stroke="var(--chart-2)" strokeWidth={2} />
      </ReLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;