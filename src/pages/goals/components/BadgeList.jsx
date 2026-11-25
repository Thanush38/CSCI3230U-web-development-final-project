import useCompletedList from "../hooks/useCompletedList";
import Badge from "./Badge";
import { useCallback, useMemo } from "react";

export default function BadgeList(props) {

    const [badges, loading, error] = useCompletedList()

    const evaluateTier = useCallback((count) => {
            return Math.min(Math.ceil(count / 5), 7)
        }, []
    )

    const badgeData = useMemo(
        () => {
            if (loading || error) return []

            const bodyPartsCount = new Map()
            const equipmentsCount = new Map()
            const targetMuscleCount = new Map()

            for (const data of badges) {
                for (const bodyPart of data.data.bodyParts) {
                    bodyPartsCount.set(
                        bodyPart, 
                        bodyPartsCount.has(bodyPart) ? 
                            bodyPartsCount.get(bodyPart) + 1 : 1
                    )
                }

                for (const equipment of data.data.equipments) {
                    equipmentsCount.set(
                        equipment, 
                        equipmentsCount.has(equipment) ? 
                            equipmentsCount.get(equipment) + 1 : 1
                    )
                }

                for (const targetMuscle of data.data.targetMuscles) {
                    targetMuscleCount.set(
                        targetMuscle, 
                        targetMuscleCount.has(targetMuscle) ? 
                            targetMuscleCount.get(targetMuscle) + 1 : 1
                    )
                }
                
            }

            const badgeData = []

            for (const bodyPart of bodyPartsCount.keys()) {
                badgeData.push({
                    id: crypto.randomUUID(),
                    name: bodyPart,
                    type: 'Body Part',
                    tier: evaluateTier(bodyPartsCount.get(bodyPart))
                })
            }

            for (const equipment of equipmentsCount.keys()) {
                badgeData.push({
                    id: crypto.randomUUID(),
                    name: equipment,
                    type: 'Equipment',
                    tier: evaluateTier(equipmentsCount.get(equipment))
                })
            }

            for (const targetMuscle of targetMuscleCount.keys()) {
                badgeData.push({
                    id: crypto.randomUUID(),
                    name: targetMuscle,
                    type: 'Target Muscle',
                    tier: evaluateTier(targetMuscleCount.get(targetMuscle))
                })
            }

            return badgeData

        }, [badges, loading, error]
    )        

    return <div id="badges">
        <h4>Badges</h4>
        <div id="badge-display">
            {loading ? <p>Loading Badges</p> :
            error ? <p>Error Loading Badges</p> : 
            badgeData.length === 0 ? <p>No Badges</p> :
            badgeData.map((data) => 
            <Badge 
            key={data.id} 
            name={data.name}
            tier={data.tier} 
            />
            )}
        </div>
    </div>
}