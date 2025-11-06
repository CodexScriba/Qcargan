-- Materialized Views for Phase 2+ Performance Optimization
-- Note: These are defined but NOT used in Phase 1

-- vehicles_with_media materialized view
CREATE MATERIALIZED VIEW vehicles_with_media AS
SELECT
  v.*,
  jsonb_build_object(
    'images', COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'url', storage_path,
            'alt', COALESCE(alt_text, v.brand || ' ' || v.model),
            'isHero', is_hero
          ) ORDER BY display_order
        )
        FROM vehicle_images vi
        WHERE vi.vehicle_id = v.id
      ),
      '[]'::jsonb
    ),
    'heroIndex', COALESCE(
      (
        SELECT display_order
        FROM vehicle_images
        WHERE vehicle_id = v.id AND is_hero = true
        LIMIT 1
      ),
      0
    )
  ) as media
FROM vehicles v
WHERE v.is_published = true;

CREATE UNIQUE INDEX idx_vehicles_with_media_id ON vehicles_with_media(id);
CREATE INDEX idx_vehicles_with_media_slug ON vehicles_with_media(slug);

-- vehicles_with_pricing materialized view
CREATE MATERIALIZED VIEW vehicles_with_pricing AS
SELECT
  v.id,
  v.slug,
  v.brand,
  v.model,
  v.year,
  v.variant,
  MIN(vp.amount) as price_min,
  MAX(vp.amount) as price_max,
  COUNT(DISTINCT vp.organization_id) as seller_count,
  (
    SELECT jsonb_build_object(
      'amount', vp2.amount,
      'organization_id', vp2.organization_id,
      'organization_name', o.name
    )
    FROM vehicle_pricing vp2
    JOIN organizations o ON o.id = vp2.organization_id
    WHERE vp2.vehicle_id = v.id
      AND vp2.is_active = true
    ORDER BY vp2.amount ASC
    LIMIT 1
  ) as cheapest_offer
FROM vehicles v
LEFT JOIN vehicle_pricing vp ON vp.vehicle_id = v.id AND vp.is_active = true
WHERE v.is_published = true
GROUP BY v.id;

CREATE UNIQUE INDEX idx_vehicles_with_pricing_id ON vehicles_with_pricing(id);
CREATE INDEX idx_vehicles_with_pricing_price ON vehicles_with_pricing(price_min);
