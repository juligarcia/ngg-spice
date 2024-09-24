use libc::*;

pub unsafe fn c_strings_to_vec_string(ptr: *const *const c_char) -> Vec<String> {
    // safety requires
    // all pointers point to valid memory
    // pointer to array of null-terminated array of pointers, each of which point to a null-terminated string
    let mut len: usize = 0;
    loop {
        if (*(ptr.add(len))).is_null() {
            break;
        } else {
            len += 1
        }
    }
    let s = std::slice::from_raw_parts(ptr, len);
    let mut vec = Vec::<String>::with_capacity(len);
    for &srcs in s.iter() {
        vec.push(std::ffi::CStr::from_ptr(srcs).to_str().unwrap().to_owned());
    }
    vec
}
