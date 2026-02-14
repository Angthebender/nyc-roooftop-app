from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client, ClientOptions
import os
from dotenv import load_dotenv
from uuid import UUID
import base64
import time

load_dotenv()
app = Flask(__name__)
CORS(app)

from supabase import create_client


# Debug: Print environment variables (remove sensitive data)
print("=== ENVIRONMENT VARIABLES ===")
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")
supabase_super_key=os.getenv("SUPABASE_SERVICE_ROLE_KEY")
pfp_bucket=os.getenv("PFP_BUCKET")

# Initialize Supabase client
try:
    supabase = create_client(supabase_url, supabase_super_key)
    print("✅ Supabase client created successfully")
except Exception as e:
    print(f"❌ Error creating Supabase client: {e}")
    supabase = None
  
def fetchwithImages(rooftop:list):
    folder = rooftop.get("name", "").lower().replace(" ", "_")
    try:
        files = supabase.storage.from_("rooftops").list(folder)
        # files is already a list, NOT a response dict
    except Exception as e:
        print(f"Storage list failed for {folder}: {e}")   # <-- will show real error
        files = []

    urls = []
    # print(f"Found {len(files)} files in folder '{folder}'")
    for f in files:
        # f is a dict with keys: name, id, updated_at, created_at …
        key = f"{folder}/{f['name']}"
        
        urls.append(
            supabase.storage.from_("rooftops").get_public_url(key)
        )

    rooftop["images"] = urls
    return rooftop



@app.route("/details", methods=["GET"])
def details():
    print("\n=== GET THE DETIALS ===")
    rooftop_id = request.args.get('rooftopid', '').strip()
    print("rooftop_id:", rooftop_id)
    rooftops_with_images=[]
    try:
        response= supabase.table("rooftops").select("*").eq("id",rooftop_id).execute()
        rooftops=response.data
        # 2. For each rooftop, try fetching its images
        for rooftop in rooftops:
            rooftops_with_images.append(fetchwithImages(rooftop))
        print(f"{len(rooftops_with_images)} rooftops found")
        print(f"This is the rooftop: {rooftops_with_images}")
        return jsonify({"success": True, "data": rooftops_with_images}), 200
        
    
    except Exception as e:
        print("error while fetching details: ",e)
    
    
    if rooftop_id:
        
        return jsonify("got the id")
    
@app.route("/rooftops", methods=["GET"])
def get_rooftops():
    """Get all rooftops with their images"""
    print("\n=== GET ROOFTOPS REQUEST ===")

    try:
        # 1. Query rooftops table
        response = supabase.table("rooftops").select("*").execute()
        rooftops = response.data or []

        rooftops_with_images = []
        
        # 2. For each rooftop, try fetching its images
        for rooftop in rooftops:
            rooftops_with_images.append(fetchwithImages(rooftop))
        print(f"{len(rooftops_with_images)} rooftops found")
        return jsonify({"success": True, "data": rooftops_with_images}), 200

    except Exception as e:
        print(f"❌ Exception in get_rooftops: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/search", methods=["GET"])
def search_rooftops():
     # ---- 1.  log that we entered this function ----
    print("\n=== SEARCH ROOFTOPS REQUEST ===")
    
    
    # ---- 2.  safety-check: is Supabase client ready? ----
    #         if not, stop early and tell the app “database broken”
    if not supabase:
        print("❌ Supabase client not initialized")
        return jsonify({"success": False, "error": "Database not connected"}), 500
    
    # ---- 3.  read what the user typed in the search box ----
    #         it arrives as  /search?q=sky  ← “sky” is the query
    query = request.args.get('q', '').strip()
    print(f"🔍 Search query: '{query}'")
    
    # ---- 4.  if user sent empty box, just give back *all* rooftops ----
    if not query:
        print("⚠️  Empty search query, returning all rooftops")
        return get_rooftops()
    
    # ---- 5.  try the real search ----
    try:
        # Search in name and location fields
        print("🔄 Performing search query...")
        # ask Supabase:
        #   SELECT * FROM rooftops
        #   WHERE name    ILIKE '%sky%'
        #      OR location ILIKE '%sky%';
        response = supabase.table("rooftops").select("*").or_(
            f"name.ilike.%{query}%,location.ilike.%{query}%"
        ).execute()
        # how many did we get?
        print(f"📏 Search results: {len(response.data) if response.data else 0}")
        # if Supabase itself complained, tell the frontend
        # hasattr is a built-in function to check if an object has a certain attribute so liek if the response has any error
        if hasattr(response, 'error') and response.error:
            print(f"❌ Supabase error: {response.error}")
            return jsonify({"success": False, "error": str(response.error)}), 500
        # grab rows (empty list if nothing)
        rooftops = response.data or []
        print(f"✅ Found {len(rooftops)} rooftops matching '{query}'")
        rooftops_with_images = []
        #trying to get pictures
        for rooftop in rooftops:
            rooftops_with_images.append(fetchwithImages(rooftop))
        
        
        # ---- 6.  send the nice answer back to the phone ----
        return jsonify({"success": True, "data": rooftops_with_images}), 200
    # ---- 7.  if *any* random error happens, log it and reply 500 ----    
    except Exception as e:
        print(f"❌ Exception in search_rooftops: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
 
@app.route("/rooftops/nearby", methods=["GET"])
def get_nearby_rooftops():
    """Get rooftops sorted by distance from given coordinates"""
    print("\n=== GET NEARBY ROOFTOPS REQUEST ===")
    
    if not supabase:
        print("❌ Supabase client not initialized")
        return jsonify({"success": False, "error": "Database not connected"}), 500
    
    try:
        lat = request.args.get('lat', type=float)
        lng = request.args.get('lng', type=float)
        limit = request.args.get('limit', 20, type=int)
        
        print(f"📍 User location: lat={lat}, lng={lng}")
        print(f"📏 Limit: {limit}")
        
        if lat is None or lng is None:
            print("❌ Missing latitude or longitude")
            return jsonify({"success": False, "error": "Latitude and longitude are required"}), 400
        
        # Note: This assumes your rooftops table has latitude and longitude columns
        # If not, you'll need to add them to your database schema
        
        # Using PostGIS distance calculation (if you have the extension)
        # This is a more advanced query - for now, we'll return all rooftops
        # and you can implement distance calculation on the frontend
        
        print("🔄 Querying rooftops...")
        response = supabase.table("rooftops").select("*").limit(limit).execute()
        
        if hasattr(response, 'error') and response.error:
            print(f"❌ Supabase error: {response.error}")
            return jsonify({"success": False, "error": str(response.error)}), 500
        
        rooftops = response.data or []
        
        # TODO: Calculate actual distances and sort
        # For now, just return the rooftops as-is
        print(f"✅ Found {len(rooftops)} rooftops")
        
        return jsonify({
            "success": True, 
            "data": rooftops,
            "user_location": {"lat": lat, "lng": lng},
            "note": "Distance calculation not yet implemented - showing all rooftops"
        }), 200
        
    except Exception as e:
        print(f"❌ Exception in get_nearby_rooftops: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/LikedRooftopsId", methods=['GET'])
def get_liked_rooftops_id():
    uid = request.args.get('uid', '').strip()
    if not uid:
        return jsonify({"success": False, "error": "missing uid"}), 400

    try:
        resp = supabase.table("Liked_Rooftops").select("*").eq("user_id", uid).execute()
        rows = resp.data or []  
        print(f"found {len(rows)} liked rooftops")
        return jsonify({"success": True, "data": rows}), 200
    except Exception as e: 
        print(f"❌ liked rooftops error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/authstore",methods=['GET'])
def authstore():
    userid = request.args.get('uid', '').strip()
    if userid is not None:
        print ("this is the id :",userid)
        return jsonify({"success": True, "data": True}), 200

    
@app.route("/togglelike", methods=['POST'])
def togglelike():
    
    data      = request.get_json(silent=True) or {}
    token     = request.headers.get("Authorization", "").replace("Bearer ", "")
    rooftopid = data.get('rooftopid', '').strip()
    isliked   = bool(data.get('isliked', False))

    if not token or not rooftopid:
        return jsonify(success=False, error="missing token or rooftopid"), 400

    # single decode + extract user_id
    try:
        user_supabase = create_client(
            supabase_url,
            supabase_key,
            options=ClientOptions(
                headers={"Authorization": f"Bearer {token}"}
            )
        )
        jwt = user_supabase.auth.get_user(token)
        userid = jwt.user.id
    except Exception as e:
        print("JWT verify fail:", e)  # ← real reason
        return jsonify(success=False, error="invalid token"), 401

    # use the **user-scoped** client, not the anon one
    try:
        if isliked:  # UN-like
            user_supabase.table("Liked_Rooftops").delete().eq("user_id", userid).eq("rooftop_id", rooftopid).execute()
        else:          # LIKE
            user_supabase.table("Liked_Rooftops").insert({"user_id": userid, "rooftop_id": rooftopid}).execute()

        return jsonify(success=True, liked=not isliked), 200
    except Exception as e:
        print("toggle error", e)
        return jsonify(success=True, liked=not isliked), 200



#update the user here:
@app.route("/updateuser", methods=['POST'])
def updateuser():
    """
    Body:
    {
      "user_id": "uuid",
      "username": "string",
      "biography": "string",
      "profile_picture": "file_uri_or_base64"  // optional
    }
    
    """
    
    data      = request.get_json(silent=True) or {}
    
    user_id   = data.get("user_id")
    username  = data.get("username", "").strip()
    biography = data.get("biography", "").strip()
    profile_pic = data.get("profile_picture", "").strip()
  
    if not user_id or not username:
        return jsonify({"success": False, "error": "user_id and username required"}), 400

    try:
        public_url = None
        if profile_pic:
            # Check if it's a base64 string or file URI
            if profile_pic.startswith('data:image'):
                # Handle base64
                if "," in profile_pic:
                    profile_pic = profile_pic.split(",")[1]
                img_bytes = base64.b64decode(profile_pic)
            else:
                # Assume it's already a URL
                public_url = profile_pic

            if not public_url:
                # Upload to storage
                file_name = "profile.png"
                path = f"{user_id}/{file_name}"
                
                # Get bucket name from environment
                bucket_name = os.getenv("PFP_BUCKET")
                
                try:
                    # Delete old profile picture if exists
                    try:
                        supabase.storage.from_(bucket_name).remove([path])
                    except:
                        pass  # Ignore if file doesn't exist
                    
                    # Upload new picture
                    supabase.storage.from_(bucket_name).upload(
                        path=path,
                        file=img_bytes,
                        file_options={"content-type": "image/png", "upsert": "true"}
                    )
                    

                    public_url = (
                        supabase.storage
                        .from_(bucket_name)
                        .get_public_url(path)
                        + f"?v={int(time.time())}"
                    )

                    print(f"✅ Uploaded profile picture to: {public_url}")
                except Exception as upload_error:
                    print(f"❌ Upload error: {upload_error}")
                    # Continue without profile picture if upload fails
                    public_url = None
        else:
            print("ℹ️ No profile picture provided")

        # Update Users table
        update_data = {
            "username": username,
            "biography": biography,
        }
        
        if public_url is not None:
            update_data["profile_picture"] = public_url

        resp = supabase.table("Users").update(update_data).eq("id", user_id).execute()

        if resp.data:
            print(f"✅ User updated successfully: {user_id}")
            return jsonify({"success": True, "data": resp.data[0]}), 200
        else:
            print(f"❌ Update failed for user: {user_id}")
            return jsonify({"success": False, "error": "update failed"}), 500

    except Exception as e:
        print(f"❌ updateuser error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":   
    app.run(debug=True, host="0.0.0.0", port=5000)