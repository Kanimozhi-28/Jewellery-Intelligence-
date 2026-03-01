# Database Schema Documentation

**Database:** `jewel_mob`
**Host:** `10.100.21.222`

---

### Table: `customers`

| Column Name | Data Type | Nullable |
| :--- | :--- | :---: |
| **id** | `integer` | NO |
| **short_id** | `character varying` | YES |
| **face_embedding_id** | `character varying` | YES |
| **first_seen** | `timestamp without time zone` | YES |
| **last_seen** | `timestamp without time zone` | YES |
| **total_visits** | `integer` | YES |
| **current_floor** | `character varying` | YES |
| **is_in_store** | `boolean` | YES |
| **embedding** | `text` | YES |
| **customer_jpg** | `text` | YES |
| **family_id** | `integer` | YES |
| **family_relationship** | `character varying` | YES |

---

### Table: `events`

| Column Name | Data Type | Nullable |
| :--- | :--- | :---: |
| **id** | `integer` | NO |
| **customer_id** | `text` | YES |
| **camera_name** | `text` | YES |
| **timestamp** | `timestamp without time zone` | YES |

---

### Table: `family_clusters`

| Column Name | Data Type | Nullable |
| :--- | :--- | :---: |
| **id** | `integer` | NO |
| **name** | `character varying` | YES |
| **created_at** | `timestamp without time zone` | YES |

---

### Table: `family_members`

| Column Name | Data Type | Nullable |
| :--- | :--- | :---: |
| **cluster_id** | `integer` | NO |
| **customer_id** | `integer` | NO |

---

### Table: `jewels`

| Column Name | Data Type | Nullable |
| :--- | :--- | :---: |
| **id** | `integer` | NO |
| **barcode** | `character varying` | NO |
| **name** | `character varying` | YES |
| **description** | `text` | YES |
| **price** | `numeric` | YES |
| **stock** | `integer` | YES |
| **photo_url** | `character varying` | YES |
| **created_at** | `timestamp without time zone` | YES |

---

### Table: `ml_detections`

| Column Name | Data Type | Nullable |
| :--- | :--- | :---: |
| **id** | `integer` | NO |
| **random_id** | `character varying` | YES |
| **photo_path** | `character varying` | YES |
| **timestamp** | `timestamp without time zone` | YES |
| **floor** | `character varying` | YES |

---

### Table: `sales_history`

| Column Name | Data Type | Nullable |
| :--- | :--- | :---: |
| **id** | `integer` | NO |
| **salesperson_id** | `integer` | YES |
| **customer_id** | `integer` | YES |
| **session_id** | `integer` | YES |
| **start_time** | `timestamp without time zone` | YES |
| **end_time** | `timestamp without time zone` | YES |
| **duration_seconds** | `integer` | YES |
| **jewels_shown** | `text` | YES |
| **total_price_shown** | `double precision` | YES |
| **result** | `character varying` | YES |
| **created_at** | `timestamp without time zone` | YES |

---

### Table: `salesman_trigger`

| Column Name | Data Type | Nullable |
| :--- | :--- | :---: |
| **id** | `integer` | NO |
| **salesperson_id** | `integer` | YES |
| **sales_person_name** | `character varying` | YES |
| **customer_id** | `integer` | YES |
| **customer_short_id** | `character varying` | YES |
| **customer_jpg** | `character varying` | YES |
| **time_stamp** | `timestamp without time zone` | YES |
| **floor** | `character varying` | YES |
| **is_notified** | `boolean` | YES |

---

### Table: `session_details`

| Column Name | Data Type | Nullable |
| :--- | :--- | :---: |
| **id** | `integer` | NO |
| **session_id** | `integer` | YES |
| **jewel_id** | `integer` | YES |
| **action** | `character varying` | YES |
| **comments** | `text` | YES |
| **timestamp** | `timestamp without time zone` | YES |

---

### Table: `sessions`

| Column Name | Data Type | Nullable |
| :--- | :--- | :---: |
| **id** | `integer` | NO |
| **salesperson_id** | `integer` | YES |
| **customer_id** | `integer` | YES |
| **start_time** | `timestamp without time zone` | YES |
| **end_time** | `timestamp without time zone` | YES |
| **status** | `character varying` | YES |
| **notes** | `text` | YES |

---

### Table: `users`

| Column Name | Data Type | Nullable |
| :--- | :--- | :---: |
| **id** | `integer` | NO |
| **username** | `character varying` | NO |
| **password_hash** | `character varying` | NO |
| **full_name** | `character varying` | YES |
| **role** | `character varying` | YES |
| **is_active** | `boolean` | YES |
| **created_at** | `timestamp without time zone` | YES |
| **unique_id** | `text` | YES |
| **embedding** | `text` | YES |
| **customer_jpg** | `text` | YES |
| **floor** | `character varying` | YES |
| **status** | `character varying` | YES |

---

