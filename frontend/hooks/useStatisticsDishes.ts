import { fetchData } from "@/constants/fetchData";
import { useEffect, useState } from "react";
import { StatisticsDish } from "@/interfaces/StatisticsDish";

const useStatisticsDishes = (user_id: number, visible: boolean): {
    statisticsDishes: StatisticsDish[];
    loading: boolean;
    error: string | null;
} => {
    const [statisticsDishes, setStatisticsDishes] = useState<StatisticsDish[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDishes = async () => {
            if (!user_id || !visible) return;
    
            setLoading(true);
            setError(null);
    
            try {
                const response: StatisticsDish[] = await fetchData(`statistics/get/${user_id}`);
                if (Array.isArray(response)) {
                    setStatisticsDishes(response);
                } else {
                    setError("Invalid response format");
                }
            } catch (err) {
                setError("Failed to fetch statistics");
            }
    
            setLoading(false);
        };
    
        loadDishes();
    }, [user_id, visible]);

    return { statisticsDishes, loading, error };
};

export default useStatisticsDishes;