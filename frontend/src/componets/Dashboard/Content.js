import CreateFashion from "./CreateFashion";
import Creations from "./Creations";
import Profile from "./Profile";
import StatisticsData from "./StatisticsData";

const Content = ({
  selectedItem,
  setCreators,
  creators,
  token,
  loading,
  error,
  fashions,
}) => {
  return (
    <section>
      {selectedItem === "Profile" && (
        <Profile
          creators={creators}
          setCreators={setCreators}
          token={token}
          error={error}
          loading={loading}
        />
      )}

      {selectedItem === "Add Fashion" && (
        <CreateFashion
          creators={creators}
          setCreators={setCreators}
          token={token}
        />
      )}

      {selectedItem === "My Stuffs" && (
        <Creations
          creators={creators}
          setCreators={setCreators}
          token={token}
          error={error}
          loading={loading}
        />
      )}

      {selectedItem === "Perfomance" && (
        <StatisticsData
          creator={creators}
          setCreators={setCreators}
          token={token}
          data={fashions}
        />
      )}
    </section>
  );
};

export default Content;
