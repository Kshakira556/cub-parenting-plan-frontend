import { useEffect, useState } from "react";
import Card from "../components/Card";
import { getChildren } from "../services/childrenService";
import { getVisitsByPlan } from "../services/visitsService";
import { getPlans } from "../services/plansService";
import { getMessagesByPlan } from "../services/messagesService";
import type { ParentingPlan } from "../types/api";

const Dashboard = () => {
  const [childrenCount, setChildrenCount] = useState(0);
  const [plans, setPlans] = useState<ParentingPlan[]>([]); // <-- type here
  const [upcomingVisitsCount, setUpcomingVisitsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const childrenData = await getChildren();
        setChildrenCount(childrenData.length);

        const plansData = await getPlans();
        setPlans(plansData); // now types match

        let totalUpcomingVisits = 0;
        for (const plan of plansData) {
          const visits = await getVisitsByPlan(plan.id);
          totalUpcomingVisits += visits.filter(
            (v) => new Date(v.start_time) > new Date()
          ).length;
        }
        setUpcomingVisitsCount(totalUpcomingVisits);

        let totalUnread = 0;
        for (const plan of plansData) {
          const messages = await getMessagesByPlan(plan.id);
          totalUnread += messages.filter((m) => !m.is_deleted && !m.is_flagged).length;
        }
        setUnreadMessagesCount(totalUnread);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-gray-500">Total Children</p>
          <p className="text-3xl font-semibold">{childrenCount}</p>
        </Card>
        <Card className="text-center">
          <p className="text-gray-500">Upcoming Visits</p>
          <p className="text-3xl font-semibold">{upcomingVisitsCount}</p>
        </Card>
        <Card className="text-center">
          <p className="text-gray-500">Active Plans</p>
          <p className="text-3xl font-semibold">{plans.length}</p>
        </Card>
        <Card className="text-center">
          <p className="text-gray-500">Unread Messages</p>
          <p className="text-3xl font-semibold">{unreadMessagesCount}</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
