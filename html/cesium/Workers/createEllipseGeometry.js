define(["./Matrix3-b2351961","./defaultValue-f6d5e6da","./EllipseGeometry-e2d7986e","./Math-355606c6","./Transforms-f17097e5","./Matrix2-7a8e9daf","./RuntimeError-9b4ce3fb","./combine-0c102d93","./ComponentDatatype-ab629b88","./WebGLConstants-7f557f93","./EllipseGeometryLibrary-d93d7f63","./GeometryAttribute-9c1a6bab","./GeometryAttributes-1e4ddcd2","./GeometryInstance-c4920693","./GeometryOffsetAttribute-2579b8d2","./GeometryPipeline-a9233ae3","./AttributeCompression-0b8f7b7d","./EncodedCartesian3-abad5e8c","./IndexDatatype-a9b1bc18","./IntersectionTests-f1b36d69","./Plane-5931b53e","./VertexFormat-fbdec922"],(function(e,t,r,n,i,o,s,a,l,m,c,p,u,y,d,G,f,b,E,C,x,A){"use strict";return function(n,i){return t.defined(i)&&(n=r.EllipseGeometry.unpack(n,i)),n._center=e.Cartesian3.clone(n._center),n._ellipsoid=e.Ellipsoid.clone(n._ellipsoid),r.EllipseGeometry.createGeometry(n)}}));
