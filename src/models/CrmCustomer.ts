module.exports = (sequelize: any, DataTypes: any) => {
  const CrmCustomer = sequelize.define('CrmCustomer', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenant_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
    },
    phone: {
      type: DataTypes.TEXT,
    },
    address: {
      type: DataTypes.TEXT,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
    },
    profession: {
      type: DataTypes.TEXT,
    },
    budget: {
      type: DataTypes.DECIMAL(14,2),
    },
    preferred_type: {
      type: DataTypes.ENUM('Satılık','Kiralık'),
    },
    preferred_category: {
      type: DataTypes.ENUM('Daire','Müstakil','Villa','Ofis','Dükkan','Arsa'),
    },
    min_area: {
      type: DataTypes.INTEGER,
    },
    max_area: {
      type: DataTypes.INTEGER,
    },
    min_rooms_label: {
      type: DataTypes.TEXT,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    last_contact: {
      type: DataTypes.DATE,
    },
    is_serious_buyer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    customer_notes: {
      type: DataTypes.TEXT,
    },
    assigned_agent_id: {
      type: DataTypes.UUID,
    },
    owner_user_id: {
      type: DataTypes.UUID,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'customers',
    schema: 'crm',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    indexes: [
      { fields: ['tenant_id', 'is_active'] },
      { fields: ['owner_user_id'] },
    ],
  });

  return CrmCustomer;
};


