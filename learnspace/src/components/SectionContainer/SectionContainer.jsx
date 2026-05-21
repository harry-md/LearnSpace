const SectionContainer = ({ children, className }) => {
  return (
    <>
      <div
        className={`flex items-center gap-6 mb-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 ${className}`}
      >
        {children}
      </div>
    </>
  );
};

export default SectionContainer;
