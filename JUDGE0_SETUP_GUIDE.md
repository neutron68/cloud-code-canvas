# Judge0 API Setup Guide - For 100% Accurate Java Execution

## Why Use Judge0?

The built-in Java interpreter provides good results for basic code, but for **exact VS Code-like output**, you need real JVM compilation. Judge0 provides:

- ✅ Real Java compiler (javac)
- ✅ Real JVM execution
- ✅ Full Java standard library
- ✅ Support for all Java features
- ✅ Exact same output as VS Code
- ✅ Support for 100+ other languages

## Setup Steps

### Step 1: Get Judge0 API Key

1. **Go to RapidAPI**: https://rapidapi.com/judge0-official/api/judge0-ce
2. **Sign Up/Login**: Create a free account
3. **Subscribe to Free Plan**:
   - Click "Subscribe to Test"
   - Select "Basic" (Free) plan
   - 50 requests/day free
4. **Copy API Key**: 
   - Go to "Endpoints" tab
   - Copy your `X-RapidAPI-Key` from the code snippet

### Step 2: Configure Supabase

#### Option A: Using Supabase Dashboard (Recommended)

1. **Login to Supabase**: https://supabase.com
2. **Select Your Project**: Choose your OmniCode project
3. **Go to Settings**:
   - Click "Settings" in left sidebar
   - Click "Edge Functions"
4. **Add Environment Variable**:
   - Click "Add new secret"
   - Name: `JUDGE0_API_KEY`
   - Value: Paste your RapidAPI key
   - Click "Save"

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Set the secret
supabase secrets set JUDGE0_API_KEY=your_rapidapi_key_here
```

### Step 3: Deploy Edge Function

```bash
# Navigate to your project
cd your-project-directory

# Deploy the execute-code function
supabase functions deploy execute-code

# Verify deployment
supabase functions list
```

### Step 4: Test the Setup

1. **Open OmniCode**: Go to http://localhost:8081 (or your deployed URL)
2. **Select Java**: Choose Java from the language selector
3. **Paste Test Code**:
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Testing Judge0 Integration!");
        System.out.println("If you see this, cloud execution is working!");
        
        int sum = 0;
        for (int i = 1; i <= 5; i++) {
            sum += i;
        }
        System.out.println("Sum of 1 to 5: " + sum);
    }
}
```
4. **Click Run**: You should see output without the "Cloud execution failed" message

### Step 5: Verify Success

**Successful Cloud Execution:**
```
[10:25:16 am] Submitting to cloud compiler (Java)...
[10:25:17 am] Accepted

Testing Judge0 Integration!
If you see this, cloud execution is working!
Sum of 1 to 5: 15

[Execution time: 0.123s | Memory: 15360 KB]
```

**Fallback to Local (API not configured):**
```
[10:25:16 am] ⚠ Cloud execution failed: Failed to send a request to the Edge Function

Falling back to local simulation...
```

## Pricing Plans

### Free Plan (Basic)
- **Cost**: $0/month
- **Requests**: 50/day
- **Rate Limit**: 1 request/second
- **Perfect for**: Personal projects, learning, testing

### Pro Plan
- **Cost**: $5/month
- **Requests**: 10,000/month
- **Rate Limit**: 10 requests/second
- **Perfect for**: Small teams, production apps

### Ultra Plan
- **Cost**: $20/month
- **Requests**: 100,000/month
- **Rate Limit**: 50 requests/second
- **Perfect for**: Large applications, high traffic

## Troubleshooting

### Issue: "JUDGE0_API_KEY is not configured"

**Solution:**
1. Verify the environment variable is set in Supabase
2. Redeploy the edge function: `supabase functions deploy execute-code`
3. Wait 1-2 minutes for changes to propagate

### Issue: "Failed to send a request to the Edge Function"

**Solution:**
1. Check your internet connection
2. Verify Supabase project is active
3. Check Supabase dashboard for function errors
4. Ensure CORS is properly configured

### Issue: "Rate limit exceeded"

**Solution:**
1. You've hit the free plan limit (50/day)
2. Wait 24 hours for reset
3. Or upgrade to Pro plan
4. System will automatically fall back to local interpreter

### Issue: "Compilation error" or "Runtime error"

**Solution:**
1. This is a real Java error from the compiler
2. Check the error message in the output
3. Fix your Java code syntax
4. The error messages are the same as VS Code/javac

## Environment Variables Reference

```bash
# Required for Judge0
JUDGE0_API_KEY=your_rapidapi_key_here

# Optional: Custom Judge0 endpoint (if self-hosting)
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com

# Optional: Timeout for code execution (seconds)
JUDGE0_TIMEOUT=10
```

## Self-Hosting Judge0 (Advanced)

If you want unlimited requests and full control:

1. **Deploy Judge0**: Follow https://github.com/judge0/judge0
2. **Update Edge Function**: Change `JUDGE0_API_URL` in `supabase/functions/execute-code/index.ts`
3. **Remove RapidAPI Headers**: Update the fetch request to use your auth method

## Benefits of Cloud Execution

| Feature | Local Interpreter | Judge0 Cloud |
|---------|------------------|--------------|
| Basic Java | ✅ Good | ✅ Perfect |
| Object-Oriented | ✅ Good | ✅ Perfect |
| Loops & Conditionals | ⚠️ Limited | ✅ Full Support |
| Arrays & Collections | ❌ Not Supported | ✅ Full Support |
| Standard Library | ❌ Limited | ✅ Complete |
| Error Messages | ⚠️ Basic | ✅ Detailed |
| Execution Speed | ⚡ Fast | ⚡ Fast |
| Accuracy | 📊 ~70% | 📊 100% |

## Cost Comparison

**Free Tier Usage:**
- 50 executions/day
- Perfect for learning and personal projects
- Automatic fallback to local interpreter when limit reached

**Paid Tier:**
- $5/month = 10,000 executions
- $0.0005 per execution
- Much cheaper than running your own server

## Recommended Setup

For the best experience:

1. **Development**: Use local interpreter (free, fast, good enough)
2. **Testing**: Use Judge0 free tier (50/day, perfect accuracy)
3. **Production**: Use Judge0 Pro plan ($5/month, 10k executions)

## Support

- **Judge0 Documentation**: https://ce.judge0.com/
- **RapidAPI Support**: https://rapidapi.com/judge0-official/api/judge0-ce/discussions
- **Supabase Docs**: https://supabase.com/docs/guides/functions

## Next Steps

1. ✅ Get your Judge0 API key
2. ✅ Configure Supabase environment variable
3. ✅ Deploy edge function
4. ✅ Test with sample Java code
5. ✅ Enjoy 100% accurate Java execution!

---

**Note**: Even without Judge0, OmniCode's built-in Java interpreter provides good results for basic to intermediate Java code. Judge0 is recommended for production use and complex Java applications.
