function BuildTable({ exercises }) {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Exercise</th>
          <th scope="col">Sets</th>
          <th scope="col">Reps</th>
        </tr>
      </thead>
      <tbody>
        {exercises.map((exercise) => (
          <tr key={exercise.name}>
            <td>{exercise.name}</td>
            <td>{exercise.sets}</td>
            <td>{exercise.reps}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default BuildTable;