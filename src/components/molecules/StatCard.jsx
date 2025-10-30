import ApperIcon from '@/components/ApperIcon'
import { Card, CardContent } from '@/components/atoms/Card'

const StatCard = ({ title, value, icon, trend, trendValue, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600", 
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600"
  }

  // Helper to safely format numeric values and prevent NaN warnings
  const formatValue = (val) => {
    if (val === null || val === undefined) return '0';
    if (typeof val === 'number') {
      if (Number.isNaN(val)) return '0';
      if (val === Infinity) return '∞';
      if (val === -Infinity) return '-∞';
      return val;
    }
    return val;
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{formatValue(value)}</p>
            {trend && (
              <div className="flex items-center mt-2">
                <ApperIcon 
                  name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                  className={`h-4 w-4 mr-1 ${trend === "up" ? "text-green-500" : "text-red-500"}`} 
                />
                <span className={`text-sm font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colors[color]}`}>
            <ApperIcon name={icon} className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default StatCard